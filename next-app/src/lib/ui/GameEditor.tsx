'use client';

import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  makeStyles,
  tokens,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Input,
  Field,
} from '@fluentui/react-components';
import {
  DocumentAdd24Regular,
  FolderOpen24Regular,
  Save24Regular,
  Settings24Regular,
} from '@fluentui/react-icons';
import { useState } from 'react';
import { trpc } from '@/lib/providers/TRPCProvider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  toolbar: {
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalM}`,
  },
  content: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  sidebar: {
    width: '250px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: tokens.spacingVerticalM,
    overflow: 'auto',
  },
  main: {
    flex: 1,
    padding: tokens.spacingVerticalL,
    overflow: 'auto',
  },
  gameItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacingVerticalS,
    margin: `${tokens.spacingVerticalXS} 0`,
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  selectedGame: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

interface Game {
  id: number;
  title: string;
  scenes: Array<{
    id: number;
    name: string;
    gameId: number;
  }>;
}

export function GameEditor() {
  const styles = useStyles();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isNewGameDialogOpen, setIsNewGameDialogOpen] = useState(false);
  const [newGameTitle, setNewGameTitle] = useState('');

  const { data: games = [], refetch: refetchGames } = trpc.games.getAll.useQuery();
  const createGameMutation = trpc.games.create.useMutation({
    onSuccess: () => {
      refetchGames();
      setIsNewGameDialogOpen(false);
      setNewGameTitle('');
    },
  });

  const handleCreateGame = () => {
    if (newGameTitle.trim()) {
      createGameMutation.mutate({ title: newGameTitle.trim() });
    }
  };

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
  };

  return (
    <div className={styles.root}>
      {/* Top Navbar/Toolbar */}
      <div className={styles.toolbar}>
        <Toolbar>
          {/* File Menu */}
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <MenuButton>File</MenuButton>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem
                  icon={<DocumentAdd24Regular />}
                  onClick={() => setIsNewGameDialogOpen(true)}
                >
                  New Game
                </MenuItem>
                <MenuItem icon={<FolderOpen24Regular />}>
                  Open Game
                </MenuItem>
                <MenuItem icon={<Save24Regular />}>
                  Save
                </MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>

          <ToolbarDivider />

          {/* Quick Actions */}
          <ToolbarButton
            icon={<DocumentAdd24Regular />}
            onClick={() => setIsNewGameDialogOpen(true)}
          >
            New
          </ToolbarButton>
          <ToolbarButton icon={<Save24Regular />}>
            Save
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton icon={<Settings24Regular />}>
            Settings
          </ToolbarButton>
        </Toolbar>
      </div>

      {/* Main Content Area */}
      <div className={styles.content}>
        {/* Sidebar - Games List */}
        <div className={styles.sidebar}>
          <h3>Games</h3>
          {games.map((game) => (
            <div
              key={game.id}
              className={`${styles.gameItem} ${
                selectedGame?.id === game.id ? styles.selectedGame : ''
              }`}
              onClick={() => handleGameSelect(game)}
            >
              <span>{game.title}</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>
                {game.scenes.length} scenes
              </span>
            </div>
          ))}
          {games.length === 0 && (
            <p style={{ opacity: 0.7, fontSize: '14px' }}>
              No games yet. Create your first game!
            </p>
          )}
        </div>

        {/* Main Editor Area */}
        <div className={styles.main}>
          {selectedGame ? (
            <div>
              <h2>{selectedGame.title}</h2>
              <h4>Scenes ({selectedGame.scenes.length})</h4>
              {selectedGame.scenes.map((scene) => (
                <div key={scene.id} style={{ marginBottom: '8px' }}>
                  📄 {scene.name}
                </div>
              ))}
              {selectedGame.scenes.length === 0 && (
                <p style={{ opacity: 0.7 }}>No scenes in this game yet.</p>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
              <h2>Welcome to Game Editor</h2>
              <p>Select a game from the sidebar or create a new one to get started.</p>
              <Button
                appearance="primary"
                onClick={() => setIsNewGameDialogOpen(true)}
              >
                Create New Game
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* New Game Dialog */}
      <Dialog open={isNewGameDialogOpen} onOpenChange={setIsNewGameDialogOpen}>
        <DialogSurface>
          <DialogTitle>Create New Game</DialogTitle>
          <DialogContent>
            <DialogBody>
              <div className={styles.dialogContent}>
                <Field label="Game Title" required>
                  <Input
                    value={newGameTitle}
                    onChange={(e) => setNewGameTitle(e.target.value)}
                    placeholder="Enter game title..."
                  />
                </Field>
              </div>
            </DialogBody>
            <DialogActions>
              <Button onClick={() => setIsNewGameDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                appearance="primary"
                onClick={handleCreateGame}
                disabled={!newGameTitle.trim() || createGameMutation.isPending}
              >
                {createGameMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </DialogActions>
          </DialogContent>
        </DialogSurface>
      </Dialog>
    </div>
  );
}