import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface UserProfile {
  age?: string;
  location?: string;
  cycleLength?: string;
  periodDuration?: string;
  flowIntensity?: string;
  symptoms?: string[];
  products?: string[];
  brands?: string;
  preferences?: string[];
  conditions?: string[];
  goals?: string[];
  consent?: {
    cyclePredictions: boolean;
    anonymousData: boolean;
  };
}

interface StepProps {
  onNext: (data: Partial<UserProfile>) => void;
  onBack?: () => void;
  stepNumber: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{currentStep} of {totalSteps}</Text>
    </View>
  );
};

const DemographicsStep = ({ onNext, onBack, stepNumber, totalSteps }: StepProps) => {
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <ProgressBar currentStep={stepNumber} totalSteps={totalSteps} />
      
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Tell Us About Yourself</Text>
        <Text style={styles.stepSubtitle}>This helps us personalize your experience and provide relevant insights.</Text>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Age</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            placeholderTextColor="#999"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Location</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="City, State or Country"
            placeholderTextColor="#999"
            value={location}
            onChangeText={setLocation}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color="#666" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => onNext({ age, location })}
          disabled={!age || !location}
        >
          <LinearGradient
            colors={['#FF6B9D', '#FF8E53']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const CycleBasicsStep = ({ onNext, onBack, stepNumber, totalSteps }: StepProps) => {
  const [cycleLength, setCycleLength] = useState('');
  const [periodDuration, setPeriodDuration] = useState('');
  const [flowIntensity, setFlowIntensity] = useState('');

  const flowOptions = ['Light', 'Medium', 'Heavy', 'Variable'];

  return (
    <ScrollView contentContainerStyle={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <ProgressBar currentStep={stepNumber} totalSteps={totalSteps} />
      
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Cycle Basics</Text>
        <Text style={styles.stepSubtitle}>Understanding your cycle helps us provide better predictions and insights.</Text>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Typical Cycle Length</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g., 28 days"
            placeholderTextColor="#999"
            value={cycleLength}
            onChangeText={setCycleLength}
            keyboardType="number-pad"
          />
          <Text style={styles.inputSuffix}>days</Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Period Duration</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="time-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g., 5 days"
            placeholderTextColor="#999"
            value={periodDuration}
            onChangeText={setPeriodDuration}
            keyboardType="number-pad"
          />
          <Text style={styles.inputSuffix}>days</Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Average Flow Intensity</Text>
        <View style={styles.optionContainer}>
          {flowOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                flowIntensity === option && styles.optionButtonSelected
              ]}
              onPress={() => setFlowIntensity(option)}
            >
              <Text style={[
                styles.optionButtonText,
                flowIntensity === option && styles.optionButtonTextSelected
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#666" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => onNext({ cycleLength, periodDuration, flowIntensity })}
          disabled={!cycleLength || !periodDuration || !flowIntensity}
        >
          <LinearGradient
            colors={['#FF6B9D', '#FF8E53']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const SYMPTOMS = [
  { category: 'Physical', items: ['Cramps', 'Bloating', 'Migraines', 'Headaches', 'Acne', 'Breast Tenderness', 'Fatigue', 'Nausea'] },
  { category: 'Emotional', items: ['Mood Swings', 'Anxiety', 'Sadness', 'Anger', 'Irritability', 'Stress'] },
  { category: 'Other', items: ['Food Cravings', 'Insomnia', 'Hot Flashes', 'Dizziness'] }
];

const SymptomsStep = ({ onNext, onBack, stepNumber, totalSteps }: StepProps) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <ProgressBar currentStep={stepNumber} totalSteps={totalSteps} />
      
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Common Symptoms</Text>
        <Text style={styles.stepSubtitle}>Select any symptoms you typically experience during your cycle.</Text>
      </View>
      
      {SYMPTOMS.map(category => (
        <View key={category.category} style={styles.symptomCategory}>
          <Text style={styles.categoryTitle}>{category.category}</Text>
          <View style={styles.symptomsContainer}>
            {category.items.map(symptom => (
              <TouchableOpacity 
                key={symptom} 
                style={[
                  styles.symptomButton, 
                  selectedSymptoms.includes(symptom) && styles.symptomButtonSelected
                ]} 
                onPress={() => toggleSymptom(symptom)}
              >
                <Text 
                  style={[
                    styles.symptomButtonText,
                    selectedSymptoms.includes(symptom) && styles.symptomButtonTextSelected
                  ]}
                >
                  {symptom}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#666" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => onNext({ symptoms: selectedSymptoms })}
        >
          <LinearGradient
            colors={['#FF6B9D', '#FF8E53']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const PRODUCTS = ['Pads', 'Tampons', 'Cups', 'Discs', 'Period Underwear'];
const PREFERENCES = ['Organic Cotton', 'Fragrance-Free', 'Leak-Proof', 'Eco-Friendly', 'Hypoallergenic'];

const ProductPreferencesStep = ({ onNext, onBack, stepNumber, totalSteps }: StepProps) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [brands, setBrands] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const toggleSelection = (item: string, list: string[], setList: Function) => {
    setList(
      list.includes(item)
        ? list.filter(i => i !== item)
        : [...list, item]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <ProgressBar currentStep={stepNumber} totalSteps={totalSteps} />
      
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Product Preferences</Text>
        <Text style={styles.stepSubtitle}>Help us recommend the best products for your needs.</Text>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>What do you currently use?</Text>
        <View style={styles.optionContainer}>
          {PRODUCTS.map(product => (
            <TouchableOpacity 
              key={product} 
              style={[
                styles.optionButton, 
                selectedProducts.includes(product) && styles.optionButtonSelected
              ]} 
              onPress={() => toggleSelection(product, selectedProducts, setSelectedProducts)}
            >
              <Text style={[
                styles.optionButtonText, 
                selectedProducts.includes(product) && styles.optionButtonTextSelected
              ]}>
                {product}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Preferred Brands</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="star-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g., Always, Tampax, DivaCup"
            placeholderTextColor="#999"
            value={brands}
            onChangeText={setBrands}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Special Preferences</Text>
        <View style={styles.optionContainer}>
          {PREFERENCES.map(pref => (
            <TouchableOpacity 
              key={pref} 
              style={[
                styles.optionButton, 
                selectedPreferences.includes(pref) && styles.optionButtonSelected
              ]} 
              onPress={() => toggleSelection(pref, selectedPreferences, setSelectedPreferences)}
            >
              <Text style={[
                styles.optionButtonText, 
                selectedPreferences.includes(pref) && styles.optionButtonTextSelected
              ]}>
                {pref}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#666" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => onNext({ products: selectedProducts, brands, preferences: selectedPreferences })}
        >
          <LinearGradient
            colors={['#FF6B9D', '#FF8E53']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const CONDITIONS = ['PCOS', 'Endometriosis', 'Fibroids', 'Menorrhagia', 'Adenomyosis', 'Other'];

const HealthConditionsStep = ({ onNext, onBack, stepNumber, totalSteps }: StepProps) => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <ProgressBar currentStep={stepNumber} totalSteps={totalSteps} />
      
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Health Conditions</Text>
        <Text style={styles.stepSubtitle}>
          This is completely optional. Sharing this information helps us provide more accurate insights and recommendations.
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Do you have any of these conditions?</Text>
        <View style={styles.optionContainer}>
          {CONDITIONS.map(condition => (
            <TouchableOpacity
              key={condition}
              style={[
                styles.optionButton,
                selectedConditions.includes(condition) && styles.optionButtonSelected,
              ]}
              onPress={() => toggleCondition(condition)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  selectedConditions.includes(condition) && styles.optionButtonTextSelected,
                ]}
              >
                {condition}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#666" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => onNext({ conditions: selectedConditions })}
        >
          <LinearGradient
            colors={['#FF6B9D', '#FF8E53']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.skipButton} onPress={() => onNext({})}>
        <Text style={styles.skipButtonText}>Skip this step</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const GOALS = [
  'Better symptom management',
  'Understand my cycle',
  'Find sustainable products',
  'Prepare for pregnancy',
  'Track a condition',
  'Improve overall wellness'
];

const GoalsStep = ({ onNext, onBack, stepNumber, totalSteps }: StepProps) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <ProgressBar currentStep={stepNumber} totalSteps={totalSteps} />
      
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>What are your goals?</Text>
        <Text style={styles.stepSubtitle}>Select your main objectives for using HerCircle.</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Choose your goals (select all that apply)</Text>
        <View style={styles.optionContainer}>
          {GOALS.map(goal => (
            <TouchableOpacity
              key={goal}
              style={[
                styles.optionButton,
                selectedGoals.includes(goal) && styles.optionButtonSelected,
              ]}
              onPress={() => toggleGoal(goal)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  selectedGoals.includes(goal) && styles.optionButtonTextSelected,
                ]}
              >
                {goal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#666" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => onNext({ goals: selectedGoals })}
        >
          <LinearGradient
            colors={['#FF6B9D', '#FF8E53']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const PrivacyConsentStep = ({ onNext, onBack, stepNumber, totalSteps }: StepProps) => {
  const [cyclePredictions, setCyclePredictions] = useState(true);
  const [anonymousData, setAnonymousData] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <ProgressBar currentStep={stepNumber} totalSteps={totalSteps} />
      
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Privacy & Consent</Text>
        <Text style={styles.stepSubtitle}>We respect your privacy. Please review your data settings.</Text>
      </View>

      <View style={styles.consentContainer}>
        <View style={styles.consentRow}>
          <View style={styles.consentTextContainer}>
            <Text style={styles.consentTitle}>Use my data for cycle predictions</Text>
            <Text style={styles.consentDescription}>This helps us provide accurate period and ovulation predictions</Text>
          </View>
          <TouchableOpacity 
            style={[styles.toggleButton, cyclePredictions && styles.toggleButtonActive]} 
            onPress={() => setCyclePredictions(!cyclePredictions)}
          >
            <View style={[styles.toggleCircle, cyclePredictions && styles.toggleCircleActive]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.consentRow}>
          <View style={styles.consentTextContainer}>
            <Text style={styles.consentTitle}>Allow anonymous data to improve our AI</Text>
            <Text style={styles.consentDescription}>Your data is anonymized and helps us provide better insights</Text>
          </View>
          <TouchableOpacity 
            style={[styles.toggleButton, anonymousData && styles.toggleButtonActive]} 
            onPress={() => setAnonymousData(!anonymousData)}
          >
            <View style={[styles.toggleCircle, anonymousData && styles.toggleCircleActive]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#666" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => onNext({ consent: { cyclePredictions, anonymousData } })}
        >
          <LinearGradient
            colors={['#FF6B9D', '#FF8E53']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.nextButtonText}>Complete Profile</Text>
            <Ionicons name="checkmark" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default function HealthQuizScreen() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserProfile>({});
  const router = useRouter();

  const handleNext = (data: Partial<UserProfile>) => {
    setUserData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  useEffect(() => {
    const persistAndNavigate = async () => {
      try {
        await AsyncStorage.setItem('userProfile', JSON.stringify(userData));
        await AsyncStorage.setItem('onboardingCompleted', 'true');
      } catch {}
      router.replace('/(tabs)');
    };
    if (step === 8) {
      persistAndNavigate();
    }
  }, [step, userData]);

  const renderStep = () => {
    const stepProps = { onNext: handleNext, onBack: handleBack, stepNumber: step, totalSteps: 7 };
    
    switch (step) {
      case 1:
        return <DemographicsStep {...stepProps} />;
      case 2:
        return <CycleBasicsStep {...stepProps} />;
      case 3:
        return <SymptomsStep {...stepProps} />;
      case 4:
        return <ProductPreferencesStep {...stepProps} />;
      case 5:
        return <HealthConditionsStep {...stepProps} />;
      case 6:
        return <GoalsStep {...stepProps} />;
      case 7:
        return <PrivacyConsentStep {...stepProps} />;
      default:
        return (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Setting up your personalized experience...</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderStep()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stepContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  inputGroup: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#333',
  },
  inputSuffix: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginLeft: 8,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  optionButton: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  optionButtonSelected: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  optionButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  optionButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  symptomCategory: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  symptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  symptomButton: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  symptomButtonSelected: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  symptomButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  symptomButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  consentContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  consentTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  consentDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#FF6B9D',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleCircleActive: {
    transform: [{ translateX: 10 }],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  nextButton: {
    flex: 1,
    marginLeft: 16,
    borderRadius: 16,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});
