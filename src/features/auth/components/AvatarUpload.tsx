import { useRef, useState } from 'react';
import {
  Box,
  Button,
  Avatar,
  CircularProgress,
  Typography,
  Stack,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useUploadAvatar } from '@/features/auth/hooks/useAuthMutations';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function AvatarUpload() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const uploadMutation = useUploadAvatar();

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload immediately
    uploadMutation.mutate(file);

    // Reset input so same file can be selected again
    e.target.value = '';
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Photo de profil
      </Typography>

      <Stack direction="row" gap={3} alignItems="center">
        {/* Avatar display */}
        <Box>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: 'primary.main',
              fontSize: '3rem',
            }}
            src={preview || user?.avatarUrl}
            alt={user?.firstName}
          >
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </Avatar>
        </Box>

        {/* Upload section */}
        <Box>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <Button
            variant="outlined"
            startIcon={
              uploadMutation.isPending ? (
                <CircularProgress size={20} />
              ) : (
                <CloudUploadIcon />
              )
            }
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? 'Upload...' : 'Changer la photo'}
          </Button>

          <Typography variant="caption" color="text.secondary" display="block" mt={1}>
            Max 5 MB, JPG/PNG
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
