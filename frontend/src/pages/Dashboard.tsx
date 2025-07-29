import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Card,
  CardContent,
  AppBar,
  Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await api.getNotes();
      setNotes(data);
    };
    fetchNotes();
  }, []);

  const handleCreateNote = async () => {
    const { data } = await api.createNote(newNote);
    setNotes([...notes, data]);
    setNewNote({ title: '', content: '' });
  };

  const handleDeleteNote = async (id: string) => {
    await api.deleteNote(id);
    setNotes(notes.filter((note) => note._id !== id));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={logout}>Sign Out</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5">Welcome, {user?.name}!</Typography>
            <Typography variant="body2" color="textSecondary">
              Email: {user?.email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Date of Birth: {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mb: 4 }}>
          <TextField
            label="Note Title"
            fullWidth
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Note Content"
            fullWidth
            multiline
            rows={4}
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleCreateNote} fullWidth>
            Create Note
          </Button>
        </Box>

        <Typography variant="h6">Notes</Typography>
        <List>
          {notes.map((note) => (
            <ListItem
              key={note._id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteNote(note._id)}>
                  <DeleteIcon />
                </IconButton>
              }
              sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}
            >
              <ListItemText primary={note.title} secondary={note.content} />
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
};

export default Dashboard;
