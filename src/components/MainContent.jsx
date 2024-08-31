import { Box, Button, Card, CardContent, CircularProgress, Divider, Grid, Link as MuiLink, Typography } from '@mui/material';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, signInWithGoogle } from '../auth/config/firebase-config';
import AuthenticatorSetup from '../widgets/AuthenticatorSetup';
import MinerAccount from '../widgets/MinerAccount';
import RecentFiles from '../widgets/RecentFiles';
import TransactionHistory from '../widgets/TransactionHistory';
import ProjectCard from './ProjectCard';
import ResourcesOverviewCard from './ResourcesOverviewCard';
import TerminalController from './Terminal';

// Initialize Firestore
const db = getFirestore();

const MainContent = () => {
  const [user, setUser] = useState(null);
  const [isMiner, setIsMiner] = useState(null);
  const [minerWalletId, setMinerWalletId] = useState(null);
  const [completedJobCount, setCompletedJobCount] = useState(0);
  const [currentView, setCurrentView] = useState('home');
  const [programStatus, setProgramStatus] = useState('offline'); // State for program status

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await checkMinerAccount(currentUser.email);
        const jobIds = await fetchTrainingJobsByUser(currentUser.uid);
        const jobCount = await countCompletedJobs(jobIds);
        setCompletedJobCount(jobCount);
      } else {
        handleLogin();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    signInWithGoogle()
      .then((result) => {
        setUser(result.user);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error signing in: ', error);
      });
  };

  const checkMinerAccount = async (email) => {
    try {
      const minersRef = collection(db, 'miners');
      const q = query(minersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const minerData = querySnapshot.docs[0].data();
        setIsMiner(true);
        setMinerWalletId(minerData.ethereumAddress);
        setProgramStatus('online'); // Assume program is online if miner account exists
      } else {
        setIsMiner(false);
        setProgramStatus('offline');
      }
    } catch (error) {
      console.error('Error checking miner account:', error);
      setIsMiner(false);
      setProgramStatus('offline');
    }
  };

  const fetchTrainingJobsByUser = async (userId) => {
    const trainingJobsRef = collection(db, 'training_jobs');
    const q = query(trainingJobsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const jobIds = querySnapshot.docs.map(doc => doc.id);
    return jobIds;
  };

  const countCompletedJobs = async (jobIds) => {
    const completedJobsRef = collection(db, 'completed_jobs');
    let completedJobCount = 0;

    for (const jobId of jobIds) {
      const q = query(completedJobsRef, where('jobId', '==', jobId));
      const querySnapshot = await getDocs(q);
      completedJobCount += querySnapshot.size;
    }

    return completedJobCount;
  };

  const toggleProgramStatus = () => {
    setProgramStatus(prevStatus => prevStatus === 'online' ? 'offline' : 'online');
  };

  const handleShowMinerAccount = () => {
    setCurrentView('wallet');
  };

  const handleShowRecentFiles = () => {
    setCurrentView('trainingJobs');
  };

  const handleViewTransactionHistory = () => {
    setCurrentView('transactionHistory');
  };

  const handleCashOutClick = () => {
    setCurrentView('wallet');
  };

  const handleShowHome = () => {
    setCurrentView('home');
  };

  if (user && isMiner === false) {
    return (
      <AuthenticatorSetup userEmail={user.email} onContinue={handleShowHome} />
    );
  }

  if (user && isMiner) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box
          className="min-h-screen bg-gray-100"
          sx={{
            flexGrow: 1,
            paddingX: '100px',
            marginTop: '90px',
            marginBottom: '90px',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: '600', color: '#4A4A4A' }}
              >
                Dashboard
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B6B6B' }}>
                Hi {user ? user.displayName : 'Guest Miner'}, welcome to the YoGPT Miner Dashboard!
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 3, borderWidth: '1px' }} />

          {/* Breadcrumb Navigation */}
          <Box sx={{ marginBottom: '20px' }}>
            <Typography variant="body2" sx={{ color: '#757575' }}>
              {currentView === 'home' ? (
                <MuiLink
                  component="button"
                  variant="body5"
                  onClick={handleShowHome}
                  sx={{ fontWeight: '600', color: '#3f51b5', textDecoration: 'none' }}
                >
                  Home
                </MuiLink>
              ) : currentView === 'trainingJobs' ? (
                <>
                  <MuiLink
                    component="button"
                    variant="body5"
                    onClick={handleShowHome}
                    sx={{ fontWeight: '600', color: '#3f51b5', textDecoration: 'none' }}
                  >
                    Home
                  </MuiLink>
                  {' > '}
                  <MuiLink
                    component="button"
                    variant="body5"
                    onClick={handleShowRecentFiles}
                    sx={{ fontWeight: '600', color: '#3f51b5', textDecoration: 'none' }}
                  >
                    Training Jobs
                  </MuiLink>
                </>
              ) : currentView === 'wallet' ? (
                <>
                  <MuiLink
                    component="button"
                    variant="body5"
                    onClick={handleShowHome}
                    sx={{ fontWeight: '600', color: '#3f51b5', textDecoration: 'none' }}
                  >
                    Home
                  </MuiLink>
                  {' > '}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: '#757575' }}
                  >
                    Miner Account
                  </Typography>
                </>
              ) : currentView === 'transactionHistory' ? (
                <>
                  <MuiLink
                    component="button"
                    variant="body5"
                    onClick={handleShowHome}
                    sx={{ fontWeight: '600', color: '#3f51b5', textDecoration: 'none' }}
                  >
                    Home
                  </MuiLink>
                  {' > '}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: '#757575' }}
                  >
                    Transaction History
                  </Typography>
                </>
              ) : null}
            </Typography>
          </Box>

          {/* Conditionally Render Content */}
          {currentView === 'home' ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <ProjectCard
                  user={{ name: user ? user.displayName : 'Guest Miner', email: user ? user.email : ' ' }}
                  commit={minerWalletId}
                  applications={completedJobCount.toString()}
                  programStatus={programStatus}
                  onToggleProgram={toggleProgramStatus}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {/* Resources Overview */}
                <ResourcesOverviewCard
                  title="Miner Memory Usage Overview"
                  dateRange="Monitoring memory consumed by miner"
                  activeTitle="Disk Space Used"
                  activeValue={894}
                  inactiveTitle="RAM Usage"
                  inactiveValue={341}
                  totalTitle="Total Memory Usage"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {/* Applications Overview */}
                <ResourcesOverviewCard
                  title="Training Jobs"
                  dateRange="Monitoring training jobs"
                  activeTitle="Completed Jobs"
                  activeValue={100}
                  inactiveTitle="Failed Jobs"
                  inactiveValue={10}
                  totalTitle="Total jobs"
                  buttonText="Monitor Jobs"
                  buttonLink="#"
                  onClick={handleShowRecentFiles}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Card sx={{ height: '100%', padding: 0 }}>
                  <TerminalController />
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: '600', color: '#444' }}
                      >
                        Miner Tokens
                      </Typography>
                      <Button variant="outlined" onClick={handleShowMinerAccount}>
                        Miner Account
                      </Button>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#757575', marginBottom: '20px' }}
                    >
                      Available YoGPT tokens
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: '600', marginBottom: '10px' }}
                    >
                      15
                    </Typography>
                    <Divider sx={{ marginBottom: '20px' }} />
                    <Button variant="contained" onClick={handleViewTransactionHistory} sx={{ textTransform: 'none', background: "#a777e3" }}>
                      View Transaction History
                    </Button>
                    <Divider sx={{ marginTop: '20px' }} />
                    <Box sx={{ marginTop: '20px' }}>
                      <Typography variant="body2" sx={{ color: '#757575', marginBottom: '10px' }}>
                        Tips
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#757575', marginBottom: '1px' }}>
                        For the safety of your funds, the customer service may contact you by phone to confirm your withdrawal request. Please pay attention to incoming calls.
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#757575', }}>
                        Ensure the security of your computer and browser to prevent information from being tampered with or leaked.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : currentView === 'wallet' ? (
            <MinerAccount />  // Render MinerAccount component when currentView is 'wallet'
          ) : currentView === 'transactionHistory' ? (
            <TransactionHistory />  // Render TransactionHistory component when currentView is 'transactionHistory'
          ) : (
            <RecentFiles onCashOutClick={handleCashOutClick} />  // Render RecentFiles component when currentView is 'trainingJobs'
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  );
};

export default MainContent;
