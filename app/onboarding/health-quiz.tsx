import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';

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
}

const DemographicsStep = ({ onNext }: StepProps) => {
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');

  return (
    <>
      <Text style={styles.title}>Tell Us About Yourself</Text>
      <Text style={styles.subtitle}>This helps us personalize your experience.</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="number-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Location (e.g., City, State)"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity style={styles.button} onPress={() => onNext({ age, location })}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </>
  );
};

const CycleBasicsStep = ({ onNext }: StepProps) => {
  const [cycleLength, setCycleLength] = useState('');
  const [periodDuration, setPeriodDuration] = useState('');
  const [flowIntensity, setFlowIntensity] = useState('');

  return (
    <>
      <Text style={styles.title}>Cycle Basics</Text>
      <Text style={styles.subtitle}>Help us understand your cycle.</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Typical cycle length (days)"
        value={cycleLength}
        onChangeText={setCycleLength}
        keyboardType="number-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Typical period duration (days)"
        value={periodDuration}
        onChangeText={setPeriodDuration}
        keyboardType="number-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Average flow intensity (e.g., Light, Medium, Heavy)"
        value={flowIntensity}
        onChangeText={setFlowIntensity}
      />

      <TouchableOpacity style={styles.button} onPress={() => onNext({ cycleLength, periodDuration, flowIntensity })}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </>
  );
};

const SYMPTOMS = [
  // Physical
  'Cramps', 'Bloating', 'Migraines', 'Headaches', 'Acne', 'Breast Tenderness',
  // Emotional
  'Mood Swings', 'Anxiety', 'Sadness', 'Anger',
  // Other
  'Fatigue', 'Nausea',
];

const SymptomsStep = ({ onNext }: StepProps) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  return (
    <>
      <Text style={styles.title}>Common Symptoms</Text>
      <Text style={styles.subtitle}>Select any symptoms you typically experience.</Text>
      
      <View style={styles.symptomsContainer}>
        {SYMPTOMS.map(symptom => (
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

      <TouchableOpacity style={styles.button} onPress={() => onNext({ symptoms: selectedSymptoms })}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </>
  );
};

const PRODUCTS = ['Pads', 'Tampons', 'Cups', 'Discs', 'Period Underwear'];
const PREFERENCES = ['Organic Cotton', 'Fragrance-Free', 'Leak-Proof'];

const ProductPreferencesStep = ({ onNext }: StepProps) => {
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
    <>
      <Text style={styles.title}>Product Preferences</Text>
      <Text style={styles.subtitle}>What do you currently use?</Text>
      
      <View style={styles.symptomsContainer}>
        {PRODUCTS.map(product => (
          <TouchableOpacity 
            key={product} 
            style={[
              styles.symptomButton, 
              selectedProducts.includes(product) && styles.symptomButtonSelected
            ]} 
            onPress={() => toggleSelection(product, selectedProducts, setSelectedProducts)}
          >
            <Text style={[styles.symptomButtonText, selectedProducts.includes(product) && styles.symptomButtonTextSelected]}>{product}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="What brands do you prefer?"
        value={brands}
        onChangeText={setBrands}
      />

      <Text style={styles.subtitle}>Any special preferences?</Text>
      <View style={styles.symptomsContainer}>
        {PREFERENCES.map(pref => (
          <TouchableOpacity 
            key={pref} 
            style={[
              styles.symptomButton, 
              selectedPreferences.includes(pref) && styles.symptomButtonSelected
            ]} 
            onPress={() => toggleSelection(pref, selectedPreferences, setSelectedPreferences)}
          >
            <Text style={[styles.symptomButtonText, selectedPreferences.includes(pref) && styles.symptomButtonTextSelected]}>{pref}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => onNext({ products: selectedProducts, brands, preferences: selectedPreferences })}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </>
  );
};

const CONDITIONS = ['PCOS', 'Endometriosis', 'Fibroids', 'Menorrhagia', 'Other'];

const HealthConditionsStep = ({ onNext }: StepProps) => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  return (
    <>
      <Text style={styles.title}>Health Conditions</Text>
      <Text style={styles.subtitle}>
        This is optional. Sharing this helps us provide more accurate insights.
      </Text>

      <View style={styles.symptomsContainer}>
        {CONDITIONS.map(condition => (
          <TouchableOpacity
            key={condition}
            style={[
              styles.symptomButton,
              selectedConditions.includes(condition) && styles.symptomButtonSelected,
            ]}
            onPress={() => toggleCondition(condition)}
          >
            <Text
              style={[
                styles.symptomButtonText,
                selectedConditions.includes(condition) && styles.symptomButtonTextSelected,
              ]}
            >
              {condition}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => onNext({ conditions: selectedConditions })}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.skipButton} onPress={() => onNext({})}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </>
  );
};

const GOALS = [
  'Better symptom management',
  'Understand my cycle',
  'Find sustainable products',
  'Prepare for pregnancy',
  'Track a condition',
];

const GoalsStep = ({ onNext }: StepProps) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  return (
    <>
      <Text style={styles.title}>What are your goals?</Text>
      <Text style={styles.subtitle}>Select your main objectives for using FlowCare.</Text>

      <View style={styles.symptomsContainer}>
        {GOALS.map(goal => (
          <TouchableOpacity
            key={goal}
            style={[
              styles.symptomButton,
              selectedGoals.includes(goal) && styles.symptomButtonSelected,
            ]}
            onPress={() => toggleGoal(goal)}
          >
            <Text
              style={[
                styles.symptomButtonText,
                selectedGoals.includes(goal) && styles.symptomButtonTextSelected,
              ]}
            >
              {goal}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => onNext({ goals: selectedGoals })}>
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity>
    </>
  );
};

const PrivacyConsentStep = ({ onNext }: StepProps) => {
  const [cyclePredictions, setCyclePredictions] = useState(true);
  const [anonymousData, setAnonymousData] = useState(true);

  return (
    <>
      <Text style={styles.title}>Privacy & Consent</Text>
      <Text style={styles.subtitle}>We respect your privacy. Please review your data settings.</Text>

      <View style={styles.consentRow}>
        <Text style={styles.consentText}>Use my data for cycle predictions</Text>
        <TouchableOpacity 
          style={[styles.toggleButton, cyclePredictions && styles.toggleButtonActive]} 
          onPress={() => setCyclePredictions(!cyclePredictions)}
        />
      </View>
      <View style={styles.consentRow}>
        <Text style={styles.consentText}>Allow my anonymous data to improve our AI</Text>
        <TouchableOpacity 
          style={[styles.toggleButton, anonymousData && styles.toggleButtonActive]} 
          onPress={() => setAnonymousData(!anonymousData)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => onNext({ consent: { cyclePredictions, anonymousData } })}>
        <Text style={styles.buttonText}>Complete Profile</Text>
      </TouchableOpacity>
    </>
  );
};

export default function HealthQuizScreen() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserProfile>({});

  const handleNext = (data: Partial<UserProfile>) => {
    setUserData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <DemographicsStep onNext={handleNext} />;
      case 2:
        return <CycleBasicsStep onNext={handleNext} />;
      case 3:
        return <SymptomsStep onNext={handleNext} />;
      case 4:
        return <ProductPreferencesStep onNext={handleNext} />;
      case 5:
        return <HealthConditionsStep onNext={handleNext} />;
      case 6:
        return <GoalsStep onNext={handleNext} />;
      case 7:
        return <PrivacyConsentStep onNext={handleNext} />;
      default:
        return <Text>Quiz Completed! User Data: {JSON.stringify(userData, null, 2)}</Text>;
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  consentText: {
    flex: 1,
    fontSize: 16,
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
  },
  toggleButtonActive: {
    backgroundColor: '#FF69B4',
  },
  skipButton: {
    marginTop: 10,
  },
  skipButtonText: {
    color: '#888',
    textDecorationLine: 'underline',
  },
  symptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  symptomButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
  },
  symptomButtonSelected: {
    backgroundColor: '#FFC0CB', // A lighter pink
  },
  symptomButtonText: {
    color: '#333',
  },
  symptomButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF69B4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
