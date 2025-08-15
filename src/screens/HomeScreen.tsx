/**
 * Home Screen
 * Main dashboard screen with key metrics and quick actions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IrisText, IrisCard, IrisButton } from '../components/common';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { dashboardService, DashboardOverview, PerformanceMetrics } from '../services/dashboard.service';
import { authService } from '../services/auth.service';

const { width: screenWidth } = Dimensions.get('window');

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, isPositive }) => (
  <IrisCard style={styles.metricCard}>
    <IrisText variant="caption" color="secondary">{title}</IrisText>
    <IrisText variant="h3" color="primary" style={styles.metricValue}>{value}</IrisText>
    <View style={styles.changeContainer}>
      <IrisText 
        variant="bodySmall" 
        color={isPositive ? 'success' : 'error'}
      >
        {isPositive ? '↑' : '↓'} {change}
      </IrisText>
    </View>
  </IrisCard>
);

export const HomeScreen: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
    loadUserInfo();
  }, []);

  const loadUserInfo = () => {
    const user = authService.getCurrentUser();
    if (user) {
      setUserName(user.name);
    }
  };

  const loadDashboardData = async (forceRefresh = false) => {
    try {
      setLoading(!forceRefresh);
      console.log('[HomeScreen] Loading dashboard data...');

      // Load dashboard overview and performance metrics in parallel
      const [overview, metrics] = await Promise.all([
        dashboardService.getOverview(forceRefresh),
        dashboardService.getPerformanceMetrics(forceRefresh)
      ]);

      console.log('[HomeScreen] Dashboard data loaded:', {
        overview: overview?.metrics,
        metrics: metrics
      });

      setDashboardData(overview);
      setPerformanceData(metrics);
    } catch (error) {
      console.error('[HomeScreen] Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.iris.turquoise} />
          <IrisText variant="bodyMedium" color="secondary" style={styles.loadingText}>
            Loading your dashboard...
          </IrisText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.iris.turquoise, colors.iris.peacock]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <IrisText variant="h2" color="inverse">
            Welcome back{userName ? `, ${userName.split(' ')[0]}` : ''}!
          </IrisText>
          <IrisText variant="bodyMedium" color="inverse" style={styles.subtitle}>
            Your AI Sales Team is ready
          </IrisText>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.iris.turquoise]}
            tintColor={colors.iris.turquoise}
          />
        }
      >
        {/* Metrics Section */}
        <View style={styles.section}>
          <IrisText variant="h5" color="primary" style={styles.sectionTitle}>
            Today's Performance
          </IrisText>
          
          <View style={styles.metricsGrid}>
            <MetricCard 
              title="Leads Qualified" 
              value={dashboardData?.qualifiedLeads?.toString() || '0'} 
              change={`${dashboardData?.growthRates?.prospects >= 0 ? '+' : ''}${dashboardData?.growthRates?.prospects || 0}%`}
              isPositive={dashboardData?.growthRates?.prospects >= 0}
            />
            <MetricCard 
              title="Opportunities" 
              value={dashboardData?.totalOpportunities?.toString() || '0'} 
              change={`${dashboardData?.growthRates?.messages >= 0 ? '+' : ''}${dashboardData?.growthRates?.messages || 0}%`}
              isPositive={dashboardData?.growthRates?.messages >= 0}
            />
            <MetricCard 
              title="Revenue" 
              value={dashboardData?.revenueData?.actual ? `$${(dashboardData.revenueData.actual / 1000000).toFixed(1)}M` : '$0'} 
              change={`${dashboardData?.revenueData?.growth >= 0 ? '+' : ''}${dashboardData?.revenueData?.growth || 0}%`}
              isPositive={dashboardData?.revenueData?.growth >= 0}
            />
            <MetricCard 
              title="Response Rate" 
              value={`${dashboardData?.responseRate || 0}%`}
              change={`${dashboardData?.growthRates?.responseRate >= 0 ? '+' : ''}${dashboardData?.growthRates?.responseRate || 0}%`}
              isPositive={dashboardData?.growthRates?.responseRate >= 0}
            />
          </View>
        </View>

        {/* AI Agents Status */}
        <View style={styles.section}>
          <IrisText variant="h5" color="primary" style={styles.sectionTitle}>
            AI Agents Status
          </IrisText>
          
          <IrisCard style={styles.agentCard}>
            <View style={styles.agentHeader}>
              <View style={[styles.statusDot, styles.statusActive]} />
              <IrisText variant="h6" color="primary">Lead Qualifier</IrisText>
            </View>
            <IrisText variant="bodySmall" color="secondary">
              Processed 234 leads today • 89% accuracy
            </IrisText>
          </IrisCard>

          <IrisCard style={styles.agentCard}>
            <View style={styles.agentHeader}>
              <View style={[styles.statusDot, styles.statusActive]} />
              <IrisText variant="h6" color="primary">Research Agent</IrisText>
            </View>
            <IrisText variant="bodySmall" color="secondary">
              47 company profiles analyzed • 12 insights generated
            </IrisText>
          </IrisCard>

          <IrisCard style={styles.agentCard}>
            <View style={styles.agentHeader}>
              <View style={[styles.statusDot, styles.statusWarning]} />
              <IrisText variant="h6" color="primary">Outreach Agent</IrisText>
            </View>
            <IrisText variant="bodySmall" color="secondary">
              156 emails sent • 42% open rate
            </IrisText>
                      </IrisCard>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <IrisText variant="h5" color="primary" style={styles.sectionTitle}>
            Quick Actions
          </IrisText>
          
          <View style={styles.actionButtons}>
            <IrisButton 
              title="Review Leads" 
              onPress={() => {}} 
              variant="gradient"
              fullWidth
              style={styles.actionButton}
            />
            <IrisButton 
              title="Check Analytics" 
              onPress={() => {}} 
              variant="outline"
              fullWidth
              style={styles.actionButton}
            />
            <IrisButton 
              title="View Workflows" 
              onPress={() => {}} 
              variant="outline"
              fullWidth
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
    borderBottomLeftRadius: borderRadius['2xl'],
    borderBottomRightRadius: borderRadius['2xl'],
    ...shadows.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  subtitle: {
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['3xl'],
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing['2xl'],
  },
  sectionTitle: {
    marginBottom: spacing.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.sm,
  },
  metricCard: {
    width: (screenWidth - spacing.xl * 2 - spacing.md * 2) / 2,
    margin: spacing.sm,
    padding: spacing.lg,
  },
  metricValue: {
    marginVertical: spacing.xs,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  statusActive: {
    backgroundColor: colors.success,
  },
  statusWarning: {
    backgroundColor: colors.warning,
  },
  actionButtons: {
    gap: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  loadingText: {
    marginTop: spacing.lg,
  },
});
