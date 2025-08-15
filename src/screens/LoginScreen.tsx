/**
 * Login Screen
 * Authentication screen with IRIS branding
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IrisText, IrisButton } from '../components/common';
import { colors, spacing, borderRadius, typography } from '../theme';
import { authService } from '../services/auth.service';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState(__DEV__ ? 'jchen@iriseller.com' : '');
  const [password, setPassword] = useState(__DEV__ ? 'Password123' : '');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authService.login({
        email: email.trim().toLowerCase(),
        password: password,
        rememberMe: true,
      });

      console.log('Login successful:', response.user.name);
      
      // Call the success callback to navigate to dashboard
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error messages
      let errorMessage = 'Login failed. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.iris.offBlack, colors.iris.peacock]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={[colors.iris.turquoise, colors.iris.plexBlue]}
                  style={styles.logo}
                >
                  <IrisText variant="display2" color="inverse">
                    IR
                  </IrisText>
                </LinearGradient>
              </View>
              <IrisText variant="h2" color="inverse" align="center">
                IRISeller
              </IrisText>
              <IrisText variant="bodyMedium" color="inverse" align="center" style={styles.tagline}>
                Your Complete AI Sales Team
              </IrisText>
            </View>

            {/* Login Form */}
            <View style={styles.formSection}>
              <View style={styles.inputContainer}>
                <IrisText variant="label" color="inverse" style={styles.inputLabel}>
                  EMAIL
                </IrisText>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.iris.sky50}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <IrisText variant="label" color="inverse" style={styles.inputLabel}>
                  PASSWORD
                </IrisText>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.iris.sky50}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <IrisText variant="bodySmall" color="plexBlue">
                  Forgot Password?
                </IrisText>
              </TouchableOpacity>

              <IrisButton
                title="Sign In"
                onPress={handleLogin}
                variant="gradient"
                size="large"
                fullWidth
                loading={isLoading}
                style={styles.loginButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <IrisText variant="caption" color="inverse" style={styles.dividerText}>
                  OR
                </IrisText>
                <View style={styles.dividerLine} />
              </View>

              <IrisButton
                title="Sign in with SSO"
                onPress={() => {}}
                variant="outline"
                size="large"
                fullWidth
                style={styles.ssoButton}
                textStyle={{ color: colors.iris.plexBlue }}
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <IrisText variant="bodySmall" color="inverse" align="center">
                Don't have an account?{' '}
                <IrisText variant="bodySmall" color="plexBlue">
                  Contact Sales
                </IrisText>
              </IrisText>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing['2xl'],
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    marginTop: spacing.sm,
    opacity: 0.8,
  },
  formSection: {
    marginBottom: spacing['2xl'],
  },
  inputContainer: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.bodyMedium,
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.iris.sky30,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.iris.peacock10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing['2xl'],
  },
  loginButton: {
    marginBottom: spacing.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.iris.sky30,
  },
  dividerText: {
    marginHorizontal: spacing.lg,
  },
  ssoButton: {
    borderColor: colors.iris.plexBlue,
  },
  footer: {
    marginTop: spacing['2xl'],
  },
});
