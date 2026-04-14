import { http, HttpResponse } from 'msw';
import {
  mockUser,
  mockClubs,
  mockMemberships,
  mockEvents,
  mockAnnouncements,
  mockDocuments,
  mockKPIs,
  mockFAQs,
  mockLogs,
} from './data';
import { DEV_PERSONAS } from './devSwitch';
import { User } from '@/shared/types/auth.types';

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

/** Resolve the current user from the Bearer token. */
function resolveUser(request: Request): User {
  const auth = request.headers.get('Authorization') ?? '';
  const token = auth.replace('Bearer ', '').trim();
  const persona = DEV_PERSONAS.find((p) => `mock-token-${p.id}` === token);
  return persona?.user ?? mockUser;
}

export const handlers = [
  // ── Auth ──────────────────────────────────────────────────────────────────
  http.post(`${BASE}/api/auth/login`, async ({ request }) => {
    const { email } = (await request.json()) as { email: string; password: string };
    const persona = DEV_PERSONAS.find((p) => p.email === email) ?? DEV_PERSONAS[0];
    const token = `mock-token-${persona.id}`;
    return HttpResponse.json({ accessToken: token, user: persona.user ?? mockUser });
  }),
  http.post(`${BASE}/api/auth/register`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    const newUser: User = {
      id: `u${Date.now()}`,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      role: 'MEMBER',
      createdAt: new Date().toISOString(),
    };
    const token = `mock-token-new-${newUser.id}`;
    return HttpResponse.json({ accessToken: token, user: newUser }, { status: 201 });
  }),
  http.get(`${BASE}/api/auth/me`, ({ request }) => HttpResponse.json(resolveUser(request))),

  // ── Clubs ─────────────────────────────────────────────────────────────────
  http.get(`${BASE}/api/clubs`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 12);
    const filtered = search
      ? mockClubs.filter(
          (c) =>
            c.name.toLowerCase().includes(search) ||
            c.category.toLowerCase().includes(search),
        )
      : mockClubs;
    const start = page * size;
    return HttpResponse.json({
      content: filtered.slice(start, start + size),
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      size,
    });
  }),
  http.get(`${BASE}/api/clubs/:id`, ({ params }) => {
    const club = mockClubs.find((c) => c.id === params.id);
    return club ? HttpResponse.json(club) : HttpResponse.json({ message: 'Club non trouvé' }, { status: 404 });
  }),
  http.post(`${BASE}/api/clubs`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newClub = { ...body, id: `c${Date.now()}`, memberCount: 0, isActive: true, adminId: mockUser.id, createdAt: new Date().toISOString() };
    mockClubs.push(newClub as never);
    return HttpResponse.json(newClub, { status: 201 });
  }),
  http.put(`${BASE}/api/clubs/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const idx = mockClubs.findIndex((c) => c.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Club non trouvé' }, { status: 404 });
    mockClubs[idx] = { ...mockClubs[idx], ...body };
    return HttpResponse.json(mockClubs[idx]);
  }),

  // ── Memberships ───────────────────────────────────────────────────────────
  http.post(`${BASE}/api/memberships/apply`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const user = resolveUser(request);
    const club = mockClubs.find((c) => c.id === body.clubId);
    const newM = {
      id: `m${Date.now()}`,
      clubId: body.clubId as string,
      clubName: club?.name ?? '',
      userId: user.id,
      userFullName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      status: 'EN_ATTENTE' as const,
      motivation: body.motivation as string,
      cotisationPayee: false,
      commentaire: '',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockMemberships.push(newM);
    return HttpResponse.json(newM, { status: 201 });
  }),
  http.get(`${BASE}/api/memberships/me`, ({ request }) => {
    const user = resolveUser(request);
    return HttpResponse.json(mockMemberships.filter((m) => m.userId === user.id));
  }),
  http.get(`${BASE}/api/clubs/:clubId/memberships`, ({ params }) => {
    const list = mockMemberships.filter(
      (m) => m.clubId === params.clubId && m.status === 'EN_ATTENTE',
    );
    return HttpResponse.json({ content: list, totalElements: list.length, totalPages: 1, number: 0, size: 20 });
  }),
  http.post(`${BASE}/api/memberships/:id/approve`, ({ params }) => {
    const m = mockMemberships.find((x) => x.id === params.id);
    if (m) m.status = 'APPROUVEE';
    return HttpResponse.json(m);
  }),
  http.post(`${BASE}/api/memberships/:id/reject`, ({ params }) => {
    const m = mockMemberships.find((x) => x.id === params.id);
    if (m) m.status = 'REFUSEE';
    return HttpResponse.json(m);
  }),

  // ── Events ────────────────────────────────────────────────────────────────
  http.get(`${BASE}/api/events`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 12);
    const start = page * size;
    return HttpResponse.json({
      content: mockEvents.slice(start, start + size),
      totalElements: mockEvents.length,
      totalPages: Math.ceil(mockEvents.length / size),
      number: page,
      size,
    });
  }),
  http.get(`${BASE}/api/events/:id`, ({ params }) => {
    const ev = mockEvents.find((e) => e.id === params.id);
    return ev ? HttpResponse.json(ev) : HttpResponse.json({ message: 'Événement non trouvé' }, { status: 404 });
  }),
  http.post(`${BASE}/api/events`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const club = mockClubs.find((c) => c.id === body.clubId);
    const newEv = { ...body, id: `e${Date.now()}`, clubName: club?.name ?? '', registeredCount: 0, checkInCode: 'CODE123', createdAt: new Date().toISOString() };
    mockEvents.push(newEv as never);
    return HttpResponse.json(newEv, { status: 201 });
  }),
  http.put(`${BASE}/api/events/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const idx = mockEvents.findIndex((e) => e.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Non trouvé' }, { status: 404 });
    mockEvents[idx] = { ...mockEvents[idx], ...body };
    return HttpResponse.json(mockEvents[idx]);
  }),
  http.post(`${BASE}/api/events/:id/register`, ({ params }) => {
    const ev = mockEvents.find((e) => e.id === params.id);
    if (ev) ev.registeredCount += 1;
    return HttpResponse.json({ message: 'Inscription confirmée' });
  }),
  http.post(`${BASE}/api/events/:id/checkin`, () =>
    HttpResponse.json({ message: 'Check-in effectué' }),
  ),

  // ── Announcements ─────────────────────────────────────────────────────────
  http.get(`${BASE}/api/announcements`, () => HttpResponse.json(mockAnnouncements)),
  http.post(`${BASE}/api/announcements`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newA = { ...body, id: `a${Date.now()}`, authorId: mockUser.id, authorName: `${mockUser.firstName} ${mockUser.lastName}`, createdAt: new Date().toISOString() };
    mockAnnouncements.unshift(newA as never);
    return HttpResponse.json(newA, { status: 201 });
  }),

  // ── Documents ─────────────────────────────────────────────────────────────
  http.get(`${BASE}/api/documents`, () => HttpResponse.json(mockDocuments)),
  http.post(`${BASE}/api/documents`, async () => {
    const newDoc = { id: `d${Date.now()}`, name: 'Nouveau document', fileUrl: '#', mimeType: 'application/pdf', sizeBytes: 102400, uploadedBy: `${mockUser.firstName} ${mockUser.lastName}`, uploadedAt: new Date().toISOString(), visibleToRoles: ['MEMBER'] };
    mockDocuments.unshift(newDoc as never);
    return HttpResponse.json(newDoc, { status: 201 });
  }),

  // ── Dashboard ─────────────────────────────────────────────────────────────
  http.get(`${BASE}/api/dashboard/kpis`, () => HttpResponse.json(mockKPIs)),

  // ── Chatbot ───────────────────────────────────────────────────────────────
  http.post(`${BASE}/api/chatbot/ask`, async ({ request }) => {
    const { message } = (await request.json()) as { message: string };
    const lower = message.toLowerCase();
    if (lower.includes('club')) {
      return HttpResponse.json({
        answer: 'Pour rejoindre un club, allez dans la page "Clubs" et cliquez sur "Rejoindre". Votre demande sera examinée par l\'administrateur.',
        suggestedActions: [
          { label: 'Voir les clubs', value: 'liste des clubs' },
          { label: 'Comment postuler ?', value: 'comment postuler dans un club' },
        ],
      });
    }
    if (lower.includes('événement') || lower.includes('event')) {
      return HttpResponse.json({
        answer: 'Vous pouvez consulter tous les événements dans la section "Événements". Les membres peuvent s\'inscrire directement en ligne.',
        suggestedActions: [{ label: 'Voir les événements', value: 'liste des événements' }],
      });
    }
    if (lower.includes('humain') || lower.includes('contact') || lower.includes('support')) {
      return HttpResponse.json({
        answer: 'Je vous redirige vers notre équipe de support. Envoyez un email à support@uniclubs.fr ou appelez le +212 5XX-XXXXXX.',
        escalate: true,
      });
    }
    return HttpResponse.json({
      answer: 'Je suis l\'assistant FAQ de UniClubs 🎓. Je peux vous aider sur les clubs, adhésions, événements et documents. Que souhaitez-vous savoir ?',
      suggestedActions: [
        { label: 'Rejoindre un club', value: 'comment rejoindre un club' },
        { label: 'Créer un événement', value: 'comment créer un événement' },
        { label: 'Contacter le support', value: 'contacter un humain' },
      ],
    });
  }),
  http.get(`${BASE}/api/chatbot/faqs`, () => HttpResponse.json(mockFAQs)),
  http.post(`${BASE}/api/chatbot/faqs`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newFAQ = { ...body, id: `f${Date.now()}`, createdAt: new Date().toISOString() };
    mockFAQs.push(newFAQ as never);
    return HttpResponse.json(newFAQ, { status: 201 });
  }),
  http.get(`${BASE}/api/chatbot/logs`, () => HttpResponse.json(mockLogs)),

  // ── Notifications ────────────────────────────────────────────────────────
  http.get(`${BASE}/api/notifications`, () => HttpResponse.json([
    { id: 'n1', message: 'Votre adh\u00e9sion au Club Informatique a \u00e9t\u00e9 approuv\u00e9e', canal: 'IN_APP', dateEnvoi: '2025-04-07T10:00:00Z', statut: 'NON_LUE', link: '/memberships' },
    { id: 'n2', message: 'Nouvel \u00e9v\u00e9nement: Hackathon IA 2025', canal: 'IN_APP', dateEnvoi: '2025-04-06T14:00:00Z', statut: 'NON_LUE', link: '/events/e1' },
    { id: 'n3', message: 'Bienvenue sur UniClubs !', canal: 'IN_APP', dateEnvoi: '2025-04-01T08:00:00Z', statut: 'LUE' },
  ])),

  // ── Admin ──────────────────────────────────────────────────────────────────
  http.get(`${BASE}/api/admin/users`, () => HttpResponse.json([
    { id: 'u1', email: 'admin@uniclubs.fr', firstName: 'Admin', lastName: 'Platform', role: 'PLATFORM_ADMIN', createdAt: '2025-01-01T00:00:00Z' },
    { id: 'u2', email: 'clubadmin@uniclubs.fr', firstName: 'Ali', lastName: 'Benali', role: 'CLUB_ADMIN', createdAt: '2025-02-01T00:00:00Z' },
    { id: 'u3', email: 'member@uniclubs.fr', firstName: 'Sara', lastName: 'Idrissi', role: 'MEMBER', createdAt: '2025-03-01T00:00:00Z' },
    { id: 'u4', email: 'visitor@uniclubs.fr', firstName: 'Youssef', lastName: 'Tazi', role: 'VISITOR', createdAt: '2025-03-15T00:00:00Z' },
  ])),
  http.put(`${BASE}/api/admin/users/:id/role`, async ({ params, request }) => {
    const { role } = (await request.json()) as { role: string };
    return HttpResponse.json({ id: params.id, role, message: 'R\u00f4le mis \u00e0 jour' });
  }),
  http.post(`${BASE}/api/clubs/:id/validate`, ({ params }) => {
    const club = mockClubs.find((c) => c.id === params.id);
    if (club) club.statut = 'VALIDE';
    return HttpResponse.json({ ...club, message: 'Club valid\u00e9' });
  }),
  http.post(`${BASE}/api/clubs/:id/suspend`, ({ params }) => {
    const club = mockClubs.find((c) => c.id === params.id);
    if (club) club.statut = 'SUSPENDU';
    return HttpResponse.json({ ...club, message: 'Club suspendu' });
  }),

  // ── My registrations (events I'm registered to) ────────────────────────
  http.get(`${BASE}/api/events/my-registrations`, () =>
    HttpResponse.json([
      { id: 'ir1', eventId: 'e1', eventTitle: 'Hackathon IA 2025', userId: 'u10', userFullName: 'Sara Moukrim', dateInscription: '2025-03-20T10:00:00Z', statut: 'CONFIRMEE', checkinQR: false },
      { id: 'ir2', eventId: 'e2', eventTitle: 'Pitch Day \u2013 Saison 4', userId: 'u10', userFullName: 'Sara Moukrim', dateInscription: '2025-04-01T10:00:00Z', statut: 'EN_ATTENTE', checkinQR: false },
    ]),
  ),

  // ── Notification mark all read ──────────────────────────────────────────
  http.post(`${BASE}/api/notifications/mark-all-read`, () =>
    HttpResponse.json({ message: 'Toutes les notifications marqu\u00e9es comme lues' }),
  ),

  // ── Membership cotisation update ────────────────────────────────────────
  http.put(`${BASE}/api/memberships/:id/cotisation`, ({ params }) => {
    const m = mockMemberships.find((x) => x.id === params.id);
    if (m) m.cotisationPayee = !m.cotisationPayee;
    return HttpResponse.json(m);
  }),
];
