import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box
} from '@mui/material';
import { Edit, Delete, Save } from '@mui/icons-material';
import { PORT } from '../../PORT';
import HomeBar from "./HomeBar";

interface Opinion {
    id: number;
    recipeID: number;
    userID: number;
    opinion: string;
}

const AdminPanel = () => {
    const [recipeId, setRecipeId] = useState<string>('');
    const [opinions, setOpinions] = useState<Opinion[]>([]);
    const [editingOpinion, setEditingOpinion] = useState<Opinion | null>(null);
    const [newText, setNewText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [selectedOpinionId, setSelectedOpinionId] = useState<number | null>(null);

    const fetchOpinions = async () => {
        if (!recipeId) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:${PORT}/recipe/opinions/${recipeId}`);
            if (!response.ok) throw new Error('Błąd pobierania opinii');
            const data: Opinion[] = await response.json();
            setOpinions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Błąd pobierania opinii');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOpinion = async () => {
        if (!editingOpinion) return;

        try {
            const response = await fetch(`http://localhost:${PORT}/recipe/opinions/${editingOpinion.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ opinion: newText })
            });

            if (!response.ok) throw new Error('Błąd aktualizacji opinii');

            setOpinions(prev => prev.map(opinion =>
                opinion.id === editingOpinion.id ? {...opinion, opinion: newText} : opinion
            ));
            setSuccess('Opinia zaktualizowana pomyślnie');
            setEditingOpinion(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Błąd aktualizacji opinii');
        }
    };

    const handleDeleteOpinion = async () => {
        if (!selectedOpinionId) return;

        try {
            const response = await fetch(`http://localhost:${PORT}/recipe/opinions/${selectedOpinionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (!response.ok) throw new Error('Błąd usuwania opinii');

            setOpinions(prev => prev.filter(opinion => opinion.id !== selectedOpinionId));
            setSuccess('Opinia usunięta pomyślnie');
            setOpenDeleteDialog(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Błąd usuwania opinii');
        }
    };

    return (
        <Box>
            <HomeBar/>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom color="secondary.main">
                    Panel administracyjny opinii
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <TextField
                        label="ID przepisu"
                        variant="outlined"
                        value={recipeId}
                        onChange={(e) => setRecipeId(e.target.value)}
                        sx={{ flexGrow: 1 }}
                    />
                    <Button
                        variant="contained"
                        onClick={fetchOpinions}
                        sx={{
                            bgcolor: 'navBar.main',
                            '&:hover': { bgcolor: 'navBar.main', opacity: 0.9 }
                        }}
                    >
                        Pobierz opinie
                    </Button>
                </Box>

                {loading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}

                <List>
                    {opinions.map((opinion) => (
                        <ListItem
                            key={opinion.id}
                            secondaryAction={
                                <>
                                    <IconButton
                                        edge="end"
                                        onClick={() => {
                                            setEditingOpinion(opinion);
                                            setNewText(opinion.opinion);
                                        }}
                                        sx={{ color: 'secondary.main' }}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        onClick={() => {
                                            setSelectedOpinionId(opinion.id);
                                            setOpenDeleteDialog(true);
                                        }}
                                        sx={{ color: 'secondary.main', ml: 1 }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </>
                            }
                            sx={{
                                bgcolor: 'primary.main',
                                mb: 1,
                                borderRadius: 1,
                                boxShadow: 1
                            }}
                        >
                            {editingOpinion?.id === opinion.id ? (
                                <TextField
                                    fullWidth
                                    value={newText}
                                    onChange={(e) => setNewText(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={handleUpdateOpinion} color="primary">
                                                <Save />
                                            </IconButton>
                                        )
                                    }}
                                />
                            ) : (
                                <ListItemText
                                    primary={opinion.opinion}
                                    secondary={`Autor ID: ${opinion.userID}`}
                                    sx={{ color: 'secondary.main' }}
                                />
                            )}
                        </ListItem>
                    ))}
                </List>

                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <DialogTitle>Potwierdź usunięcie</DialogTitle>
                    <DialogContent>
                        <Typography>Czy na pewno chcesz usunąć tę opinię?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
                            Anuluj
                        </Button>
                        <Button
                            onClick={handleDeleteOpinion}
                            color="error"
                            variant="contained"
                            sx={{ bgcolor: 'secondary.main' }}
                        >
                            Usuń
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={!!error}
                    autoHideDuration={4000}
                    onClose={() => setError('')}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="error" onClose={() => setError('')}>
                        {error}
                    </Alert>
                </Snackbar>

                <Snackbar
                    open={!!success}
                    autoHideDuration={4000}
                    onClose={() => setSuccess('')}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="success" onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>

    );
};

export default AdminPanel;