import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const FLOW_LEVELS = ['Spotting', 'Light', 'Medium', 'Heavy', 'Flooding'];
const PHYSICAL_SYMPTOMS = ['Cramps', 'Headaches', 'Bloating', 'Acne', 'Breast Tenderness', 'Fatigue'];
const MOODS = ['Happy', 'Sad', 'Anxious', 'Angry'];
const ENERGY_LEVELS = ['Low', 'Medium', 'High'];
const SLEEP_QUALITY = ['Poor', 'Fair', 'Good'];
const FOCUS_LEVELS = ['Poor', 'Fair', 'Good'];
const LIFESTYLE = ['Sexual Activity (Protected)', 'Sexual Activity (Unprotected)', 'Exercise', 'Medication'];


interface LogData {
  flow?: 'Spotting' | 'Light' | 'Medium' | 'Heavy' | 'Flooding';
  physicalSymptoms?: ('Cramps' | 'Headaches' | 'Bloating' | 'Acne' | 'Breast Tenderness' | 'Fatigue')[];
  moods?: ('Happy' | 'Sad' | 'Anxious' | 'Angry')[];
  energyLevel?: 'Low' | 'Medium' | 'High';
  sleepQuality?: 'Poor' | 'Fair' | 'Good';
  focus?: 'Poor' | 'Fair' | 'Good';
  lifestyle?: ('Sexual Activity (Protected)' | 'Sexual Activity (Unprotected)' | 'Exercise' | 'Medication')[];
  notes?: string;
}

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [logs, setLogs] = useState<{ [date: string]: LogData }>({});
  const [currentLog, setCurrentLog] = useState<LogData>({
    physicalSymptoms: [],
    moods: [],
    lifestyle: [],
  });

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const storedLogs = await AsyncStorage.getItem('logs');
        if (storedLogs) {
          setLogs(JSON.parse(storedLogs));
        }
      } catch (error) {
        console.error('Failed to load logs from storage', error);
      }
    };
    loadLogs();
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    scheduleNotifications();
  }, [logs]);

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
  };

  const scheduleNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const periodDates = Object.keys(logs).filter(date => logs[date].flow).sort();
    if (periodDates.length < 2) return;

    const averageCycleLength = getAverageCycleLength();
    const lastPeriodStart = periodDates[periodDates.length - 1];
    const nextPeriodStart = new Date(lastPeriodStart);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + averageCycleLength);

    // Period start reminder
    const periodTrigger = new Date(nextPeriodStart);
    periodTrigger.setDate(periodTrigger.getDate() - 1);
    periodTrigger.setHours(9, 0, 0); // 9 AM
    
    const periodSeconds = (periodTrigger.getTime() - Date.now()) / 1000;
    if (periodSeconds > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Heads up!",
          body: "Your period is predicted to start tomorrow. Remember to pack your kit.",
        },
        trigger: { seconds: periodSeconds, repeats: false, type: 'interval' }, // Added repeats: false, type: 'interval'
      });
    }

    // Symptom pattern reminders
    const symptomPatterns = getSymptomPatterns(true) as { symptom: string; day: number; }[];
    symptomPatterns.forEach(pattern => {
      const triggerDate = new Date(nextPeriodStart);
      triggerDate.setDate(triggerDate.getDate() + pattern.day); // Adjust to day of cycle
      triggerDate.setHours(9, 0, 0);

      const symptomSeconds = (triggerDate.getTime() - Date.now()) / 1000;
      if (symptomSeconds > 0) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Symptom Alert",
            body: `Based on your logs, you might experience ${pattern.symptom} on day ${pattern.day} of your cycle.`,
          },
          trigger: { seconds: symptomSeconds, repeats: false, type: 'interval' }, // Added repeats: false, type: 'interval'
        });
      }
    });

    // Energy-based workout reminder
    const energyPatterns = getEnergyPatterns();
    energyPatterns.forEach(pattern => {
      const triggerDate = new Date(nextPeriodStart);
      triggerDate.setDate(triggerDate.getDate() + pattern.day); // Adjust to day of cycle
      triggerDate.setHours(9, 0, 0);

      const energySeconds = (triggerDate.getTime() - Date.now()) / 1000;
      if (energySeconds > 0) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Workout Suggestion",
            body: `Based on your logs, your energy is typically low on day ${pattern.day} of your cycle. Consider a lighter workout today.`,
          },
          trigger: { seconds: energySeconds, repeats: false, type: 'interval' }, // Added repeats: false, type: 'interval'
        });
      }
    });
  };

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    setCurrentLog(logs[day.dateString] || {
      physicalSymptoms: [],
      moods: [],
      lifestyle: [],
    });
    setModalVisible(true);
  };

  const handleSaveLog = async () => {
    const newLogs = { ...logs, [selectedDate]: currentLog };
    setLogs(newLogs);
    try {
      await AsyncStorage.setItem('logs', JSON.stringify(newLogs));
    } catch (error) {
      console.error('Failed to save logs to storage', error);
    }
    setModalVisible(false);
  };

  const getPredictions = () => {
    const periodDates = Object.keys(logs).filter(date => logs[date].flow).sort();
    if (periodDates.length < 2) return {};

    // Calculate average cycle length
    let cycleLengths = [];
    for (let i = 1; i < periodDates.length; i++) {
      const startDate = new Date(periodDates[i-1]);
      const endDate = new Date(periodDates[i]);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      cycleLengths.push(diffDays);
    }
    const averageCycleLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length || 28;

    const lastPeriodStart = periodDates[periodDates.length - 1];
    const nextPeriodStart = new Date(lastPeriodStart);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + averageCycleLength);

    const ovulationStart = new Date(nextPeriodStart);
    ovulationStart.setDate(ovulationStart.getDate() - 14);

    const predictions: { [key: string]: any } = {};
    for (let i = 0; i < 5; i++) {
      const periodDay = new Date(nextPeriodStart);
      periodDay.setDate(periodDay.getDate() + i);
      predictions[periodDay.toISOString().split('T')[0]] = {
        startingDay: i === 0,
        endingDay: i === 4,
        color: '#FFC0CB',
      };
    }
    for (let i = 0; i < 3; i++) {
      const ovulationDay = new Date(ovulationStart);
      ovulationDay.setDate(ovulationDay.getDate() + i);
      predictions[ovulationDay.toISOString().split('T')[0]] = {
        color: '#ADD8E6',
      };
    }
    return predictions;
  };

  const getAverageCycleLength = () => {
    const periodDates = Object.keys(logs).filter(date => logs[date].flow).sort();
    if (periodDates.length < 2) return 28;

    let cycleLengths = [];
    for (let i = 1; i < periodDates.length; i++) {
      const startDate = new Date(periodDates[i-1]);
      const endDate = new Date(periodDates[i]);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      cycleLengths.push(diffDays);
    }
    return cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length || 28;
  }

  const getSymptomPatterns = (forNotifications = false) => {
    const periodDates = Object.keys(logs).filter(date => logs[date].flow).sort();
    if (periodDates.length < 2) return [];

    const symptomCounts: { [key: string]: { [day: number]: number } } = {};
    const cycleLengths = [];
    for (let i = 1; i < periodDates.length; i++) {
      const startDate = new Date(periodDates[i - 1]);
      const endDate = new Date(periodDates[i]);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      cycleLengths.push(diffDays);
    }
    const averageCycleLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length || 28;

    for (let i = 0; i < periodDates.length; i++) {
      const periodStart = new Date(periodDates[i]);
      const nextPeriodStart = i + 1 < periodDates.length ? new Date(periodDates[i + 1]) : null;
      const currentCycleLength = nextPeriodStart ? Math.ceil(Math.abs(nextPeriodStart.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)) : averageCycleLength;

      for (const date in logs) {
        const log = logs[date];
        const logDate = new Date(date);

        if (logDate >= periodStart && (nextPeriodStart ? logDate < nextPeriodStart : true)) {
          const daysSincePeriodStart = Math.ceil(Math.abs(logDate.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));

          if (log.physicalSymptoms) {
            log.physicalSymptoms.forEach(symptom => {
              if (!symptomCounts[symptom]) {
                symptomCounts[symptom] = {};
              }
              if (!symptomCounts[symptom][daysSincePeriodStart]) {
                symptomCounts[symptom][daysSincePeriodStart] = 0;
              }
              symptomCounts[symptom][daysSincePeriodStart]++;
            });
          }
        }
      }
    }

    const patterns = [];
    for (const symptom in symptomCounts) {
      for (const day in symptomCounts[symptom]) {
        if (symptomCounts[symptom][day] > 1) { // Only show patterns that have occurred more than once
          if (forNotifications) {
            patterns.push({ symptom, day: parseInt(day) });
          } else {
            patterns.push(`You tend to get ${symptom} on day ${day} of your cycle.`);
          }
        }
      }
    }
    return patterns;
  };

  const getEnergyPatterns = () => {
    const periodDates = Object.keys(logs).filter(date => logs[date].flow).sort();
    if (periodDates.length < 2) return [];

    const energyCounts: { [day: number]: number } = {};
    const cycleLengths = [];
    for (let i = 1; i < periodDates.length; i++) {
      const startDate = new Date(periodDates[i - 1]);
      const endDate = new Date(periodDates[i]);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      cycleLengths.push(diffDays);
    }
    const averageCycleLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length || 28;

    for (let i = 0; i < periodDates.length; i++) {
      const periodStart = new Date(periodDates[i]);
      const nextPeriodStart = i + 1 < periodDates.length ? new Date(periodDates[i + 1]) : null;
      const currentCycleLength = nextPeriodStart ? Math.ceil(Math.abs(nextPeriodStart.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)) : averageCycleLength;

      for (const date in logs) {
        const log = logs[date];
        const logDate = new Date(date);

        if (logDate >= periodStart && (nextPeriodStart ? logDate < nextPeriodStart : true)) {
          const daysSincePeriodStart = Math.ceil(Math.abs(logDate.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));

          if (log.energyLevel === 'Low') {
            if (!energyCounts[daysSincePeriodStart]) {
              energyCounts[daysSincePeriodStart] = 0;
            }
            energyCounts[daysSincePeriodStart]++;
          }
        }
      }
    }

    const patterns = [];
    for (const day in energyCounts) {
      if (energyCounts[day] > 1) { // Only show patterns that have occurred more than once
        patterns.push({ day: parseInt(day) });
      }
    }
    return patterns;
  };

  const generatePdf = async () => {
    const sortedLogs = Object.keys(logs).sort().reduce(
      (obj: { [key: string]: LogData }, key) => {
        obj[key] = logs[key];
        return obj;
      },
      {}
    );

    const styles = `
      <style>
        body { font-family: sans-serif; margin: 20px; color: #333; }
        h1 { color: #FF69B4; text-align: center; border-bottom: 2px solid #FF69B4; padding-bottom: 10px; }
        h2 { color: #4682B4; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 25px; }
        p { margin: 8px 0; line-height: 1.6; }
        strong { color: #000; }
        .log-entry { margin-bottom: 20px; }
      </style>
    `;

    let htmlContent = `<html><head>${styles}</head><body><h1>Cycle & Symptom Report</h1>`;
    for (const date in sortedLogs) {
      const log = sortedLogs[date];
      htmlContent += `<div class="log-entry"><h2>${date}</h2>`;
      let content = '';
      if (log.flow) content += `<p><strong>Flow:</strong> ${log.flow}</p>`;
      if (log.physicalSymptoms?.length) content += `<p><strong>Symptoms:</strong> ${log.physicalSymptoms.join(', ')}</p>`;
      if (log.moods?.length) content += `<p><strong>Moods:</strong> ${log.moods.join(', ')}</p>`;
      if (log.energyLevel) content += `<p><strong>Energy:</strong> ${log.energyLevel}</p>`;
      if (log.sleepQuality) content += `<p><strong>Sleep:</strong> ${log.sleepQuality}</p>`;
      if (log.focus) content += `<p><strong>Focus:</strong> ${log.focus}</p>`;
      if (log.lifestyle?.length) content += `<p><strong>Lifestyle:</strong> ${log.lifestyle.join(', ')}</p>`;
      if (log.notes) content += `<p><strong>Notes:</strong> ${log.notes}</p>`;
      
      if (content === '') {
        htmlContent += '<p>No data logged for this day.</p>';
      } else {
        htmlContent += content;
      }
      htmlContent += '</div>';
    }
    htmlContent += '</body></html>';

    try {
      const options = {
        html: htmlContent,
        fileName: 'HealthReport',
        directory: 'Documents',
      };
      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert('Report Generated', `PDF saved to: ${file.filePath}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to generate report.');
    }
  };

  const toggleMultiSelect = (field: 'physicalSymptoms' | 'moods' | 'lifestyle', value: string) => {
    const currentValues = currentLog[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setCurrentLog(prev => ({ ...prev, [field]: newValues }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markingType={'period'}
        markedDates={{
          ...getPredictions(),
          ...Object.keys(logs).reduce((acc: { [key: string]: any }, date) => {
            acc[date] = { ...acc[date], marked: true, dotColor: '#FF69B4' };
            return acc;
          }, {}),
          [selectedDate]: { selected: true, selectedColor: '#FF69B4' },
        }}
      />
      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>Your Symptom Patterns</Text>
        {(getSymptomPatterns() as string[]).map((pattern, index) => (
          <Text key={index} style={styles.insightText}>- {pattern}</Text>
        ))}
      </View>
      <TouchableOpacity style={styles.reportButton} onPress={generatePdf}>
        <Text style={styles.reportButtonText}>Generate Health Report</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log for {selectedDate}</Text>
            <ScrollView>
            <Text style={styles.sectionTitle}>Flow Intensity</Text>
            <View style={styles.optionsContainer}>
              {FLOW_LEVELS.map(level => (
                <TouchableOpacity
                  key={level}
                  style={[styles.optionButton, currentLog.flow === level && styles.optionButtonSelected]}
                  onPress={() => setCurrentLog(prev => ({ ...prev, flow: level }))}
                >
                  <Text style={styles.optionButtonText}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Physical Symptoms</Text>
            <View style={styles.optionsContainer}>
              {PHYSICAL_SYMPTOMS.map(symptom => (
                <TouchableOpacity
                  key={symptom}
                  style={[styles.optionButton, currentLog.physicalSymptoms?.includes(symptom) && styles.optionButtonSelected]}
                  onPress={() => toggleMultiSelect('physicalSymptoms', symptom)}
                >
                  <Text style={styles.optionButtonText}>{symptom}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Mood</Text>
            <View style={styles.optionsContainer}>
              {MOODS.map(mood => (
                <TouchableOpacity
                  key={mood}
                  style={[styles.optionButton, currentLog.moods?.includes(mood) && styles.optionButtonSelected]}
                  onPress={() => toggleMultiSelect('moods', mood)}
                >
                  <Text style={styles.optionButtonText}>{mood}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Energy Level</Text>
            <View style={styles.optionsContainer}>
              {ENERGY_LEVELS.map(level => (
                <TouchableOpacity
                  key={level}
                  style={[styles.optionButton, currentLog.energyLevel === level && styles.optionButtonSelected]}
                  onPress={() => setCurrentLog(prev => ({ ...prev, energyLevel: level }))}
                >
                  <Text style={styles.optionButtonText}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Sleep Quality</Text>
            <View style={styles.optionsContainer}>
              {SLEEP_QUALITY.map(quality => (
                <TouchableOpacity
                  key={quality}
                  style={[styles.optionButton, currentLog.sleepQuality === quality && styles.optionButtonSelected]}
                  onPress={() => setCurrentLog(prev => ({ ...prev, sleepQuality: quality }))}
                >
                  <Text style={styles.optionButtonText}>{quality}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Focus</Text>
            <View style={styles.optionsContainer}>
              {FOCUS_LEVELS.map(level => (
                <TouchableOpacity
                  key={level}
                  style={[styles.optionButton, currentLog.focus === level && styles.optionButtonSelected]}
                  onPress={() => setCurrentLog(prev => ({ ...prev, focus: level }))}
                >
                  <Text style={styles.optionButtonText}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Lifestyle</Text>
            <View style={styles.optionsContainer}>
              {LIFESTYLE.map(activity => (
                <TouchableOpacity
                  key={activity}
                  style={[styles.optionButton, currentLog.lifestyle?.includes(activity) && styles.optionButtonSelected]}
                  onPress={() => toggleMultiSelect('lifestyle', activity)}
                >
                  <Text style={styles.optionButtonText}>{activity}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Notes</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add any notes here..."
              value={currentLog.notes}
              onChangeText={text => setCurrentLog(prev => ({ ...prev, notes: text }))}
              multiline
            />
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveLog}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 20,
    margin: 5,
  },
  optionButtonSelected: {
    backgroundColor: '#FFC0CB',
  },
  optionButtonText: {
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#FF69B4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#888',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginTop: 10,
  },
  insightsContainer: {
    padding: 20,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  insightText: {
    fontSize: 16,
    marginBottom: 5,
  },
  reportButton: {
    backgroundColor: '#4682B4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  reportButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
