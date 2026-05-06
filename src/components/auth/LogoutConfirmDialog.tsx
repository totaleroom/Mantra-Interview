import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const LogoutConfirmDialog: React.FC<LogoutConfirmDialogProps> = ({ open, onOpenChange, onConfirm }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-4 border-foreground shadow-neoLg bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-xl uppercase">
            Yakin ingin logout?
          </AlertDialogTitle>
          <AlertDialogDescription className="font-body text-sm text-muted-foreground">
            Kamu akan keluar dari akun MantraSkill. Pastikan semua progress sudah tersimpan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="border-2 border-foreground font-display text-xs uppercase shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground border-2 border-foreground font-display text-xs uppercase shadow-neoSm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Ya, Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
