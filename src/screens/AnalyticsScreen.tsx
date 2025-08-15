/**
 * Analytics Screen
 * Comprehensive analytics dashboard for sales metrics
 * Generated using Figma MCP integration patterns
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IrisText, IrisCard, IrisButton } from '../components/common';
import { colors, spacing, borderRadius, shadows } from '../theme';

const { width: screenWidth } = Dimensions.get('window');

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color?: (opacity: number) => string;
  }>;
}

interface AnalyticsMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  chartData?: ChartData;
}

export const AnalyticsScreen: React.FC = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // TODO: Implement analytics API call
      const mockData: AnalyticsMetric[] = [
        {
          id: '1',
          title: 'Total Revenue',
          value: '$125,430',
          change: 12.5,
          trend: 'up',
        },
        {
          id: '2',
          title: 'Active Leads',
          value: '847',
          change: -3.2,
          trend: 'down',
        },
        {
          id: '3',
          title: 'Conversion Rate',
          value: '24.8%',
          change: 5.1,
          trend: 'up',
        },
        {
          id: '4',
          title: 'AI Agent Tasks',
          value: '1,234',
          change: 18.7,
          trend: 'up',
        },
      ];
      setMetrics(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  const MetricCard: React.FC<{ metric: AnalyticsMetric }> = ({ metric }) => (
    <IrisCard style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <IrisText variant="bodySmall" color="secondary">
          {metric.title}
        </IrisText>
        <View style={[
          styles.trendIndicator,
          { backgroundColor: metric.trend === 'up' ? colors.success : colors.error }
        ]}>
          <IrisText variant="caption" color="inverse">
            {metric.change > 0 ? '+' : ''}{metric.change}%
          </IrisText>
        </View>
      </View>
      <IrisText variant="h3" color="primary" style={styles.metricValue}>
        {metric.value}
      </IrisText>
    </IrisCard>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.iris.turquoise, colors.iris.peacock]}
        style={styles.header}
      >
        <IrisText variant="h4" color="inverse">
          Analytics Dashboard
        </IrisText>
        <IrisText variant="bodySmall" color="inverse" style={styles.subtitle}>
          Track your sales performance
        </IrisText>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['7d', '30d', '90d'] as const).map((period) => (
            <IrisButton
              key={period}
              title={period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
              variant={selectedPeriod === period ? 'primary' : 'outline'}
              size="small"
              onPress={() => setSelectedPeriod(period)}
              style={styles.periodButton}
            />
          ))}
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </View>

        {/* Chart Section */}
        <IrisCard style={styles.chartCard}>
          <IrisText variant="h6" color="primary" style={styles.chartTitle}>
            Revenue Trend
          </IrisText>
          <View style={styles.chartPlaceholder}>
            <IrisText variant="bodyMedium" color="secondary">
              Chart component will be rendered here
            </IrisText>
            <IrisText variant="caption" color="tertiary">
              (Generated from Figma design)
            </IrisText>
          </View>
        </IrisCard>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <IrisButton
            title="Export Report"
            variant="outline"
            fullWidth
            onPress={() => {}}
            style={styles.actionButton}
          />
          <IrisButton
            title="View Details"
            variant="gradient"
            fullWidth
            onPress={() => {}}
            style={styles.actionButton}
          />
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  subtitle: {
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.lg,
    gap: spacing.sm,
  },
  periodButton: {
    flex: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  metricCard: {
    width: (screenWidth - spacing.lg * 2 - spacing.md) / 2,
    padding: spacing.lg,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  trendIndicator: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  metricValue: {
    fontWeight: 'bold',
  },
  chartCard: {
    marginVertical: spacing.lg,
    padding: spacing.lg,
  },
  chartTitle: {
    marginBottom: spacing.lg,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
  },
  actions: {
    gap: spacing.md,
    marginVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },
  actionButton: {
    marginVertical: spacing.xs,
  },
});
