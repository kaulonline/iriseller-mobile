/**
 * IrisChart Component
 * Reusable chart component following IRIS design system
 * Generated from Figma designs using MCP integration
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IrisText } from './IrisText';
import { colors, spacing, borderRadius, shadows } from '../../theme';

const { width: screenWidth } = Dimensions.get('window');

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface IrisChartProps {
  data: ChartDataPoint[];
  type: 'bar' | 'line' | 'pie' | 'progress';
  title?: string;
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  style?: ViewStyle;
  animated?: boolean;
}

export const IrisChart: React.FC<IrisChartProps> = ({
  data,
  type,
  title,
  height = 200,
  showLabels = true,
  showValues = true,
  style,
  animated = true,
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const chartWidth = screenWidth - spacing.lg * 4; // Account for card padding

  const renderBarChart = () => (
    <View style={styles.barContainer}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * (height - 60); // Leave space for labels
        const barColor = item.color || colors.iris.turquoise;
        
        return (
          <View key={index} style={styles.barItem}>
            <View style={[styles.barWrapper, { height: height - 40 }]}>
              {showValues && (
                <IrisText variant="caption" color="secondary" style={styles.barValue}>
                  {item.value}
                </IrisText>
              )}
              <LinearGradient
                colors={[barColor, `${barColor}80`]}
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor: barColor,
                  }
                ]}
              />
            </View>
            {showLabels && (
              <IrisText variant="caption" color="tertiary" style={styles.barLabel}>
                {item.label}
              </IrisText>
            )}
          </View>
        );
      })}
    </View>
  );

  const renderProgressChart = () => (
    <View style={styles.progressContainer}>
      {data.map((item, index) => {
        const progressPercentage = (item.value / maxValue) * 100;
        const barColor = item.color || colors.iris.turquoise;
        
        return (
          <View key={index} style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <IrisText variant="bodySmall" color="primary">
                {item.label}
              </IrisText>
              {showValues && (
                <IrisText variant="bodySmall" color="secondary">
                  {item.value}
                </IrisText>
              )}
            </View>
            <View style={styles.progressBarContainer}>
              <LinearGradient
                colors={[barColor, `${barColor}60`]}
                style={[
                  styles.progressBar,
                  { width: `${progressPercentage}%` }
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderPieChart = () => (
    <View style={styles.pieContainer}>
      <View style={[styles.pieChart, { width: height, height: height }]}>
        <IrisText variant="bodyMedium" color="secondary">
          Pie Chart
        </IrisText>
        <IrisText variant="caption" color="tertiary">
          (Custom implementation)
        </IrisText>
      </View>
      <View style={styles.pieLegend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: item.color || colors.iris.turquoise }
              ]}
            />
            <IrisText variant="caption" color="secondary">
              {item.label}: {item.value}
            </IrisText>
          </View>
        ))}
      </View>
    </View>
  );

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'progress':
        return renderProgressChart();
      case 'pie':
        return renderPieChart();
      case 'line':
      default:
        return (
          <View style={[styles.placeholder, { height }]}>
            <IrisText variant="bodyMedium" color="secondary">
              {type.charAt(0).toUpperCase() + type.slice(1)} Chart
            </IrisText>
            <IrisText variant="caption" color="tertiary">
              Custom implementation needed
            </IrisText>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, style]}>
      {title && (
        <IrisText variant="h6" color="primary" style={styles.title}>
          {title}
        </IrisText>
      )}
      <View style={styles.chartContainer}>
        {renderChart()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  title: {
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
  
  // Bar Chart Styles
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: '100%',
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  barWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  bar: {
    width: '80%',
    borderRadius: borderRadius.sm,
    minHeight: 4,
  },
  barValue: {
    marginBottom: spacing.xs,
  },
  barLabel: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  
  // Progress Chart Styles
  progressContainer: {
    width: '100%',
  },
  progressItem: {
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  
  // Pie Chart Styles
  pieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  pieChart: {
    borderRadius: 1000,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  pieLegend: {
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  
  // Placeholder Styles
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
    width: '100%',
  },
});
