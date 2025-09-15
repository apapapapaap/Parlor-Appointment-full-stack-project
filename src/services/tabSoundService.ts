interface TabSoundConfig {
  frequency: number;
  duration: number;
  volume: number;
}

export class TabSoundService {
  private static instance: TabSoundService;
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  static getInstance(): TabSoundService {
    if (!TabSoundService.instance) {
      TabSoundService.instance = new TabSoundService();
    }
    return TabSoundService.instance;
  }

  private async initAudioContext(): Promise<AudioContext | null> {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      return this.audioContext;
    } catch (error) {
      console.warn('Audio context initialization failed:', error);
      return null;
    }
  }

  async playTabSwitchSound(tabType: 'regular' | 'bridal'): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const audioContext = await this.initAudioContext();
      if (!audioContext) return;

      // Different sound configurations for each tab
      const config: TabSoundConfig = tabType === 'regular' 
        ? { frequency: 523.25, duration: 1000, volume: 0.1 } // C5 note for regular
        : { frequency: 659.25, duration: 1000, volume: 0.1 }; // E5 note for bridal

      // Create smooth tab switch sound
      this.createTabSwitchAnimation(audioContext, config);

    } catch (error) {
      console.warn('Tab switch sound failed:', error);
    }
  }

  private createTabSwitchAnimation(audioContext: AudioContext, config: TabSoundConfig): void {
    const { frequency, duration, volume } = config;
    
    // Create oscillator for main tone
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    
    // Connect audio nodes
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure oscillator
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // Add gentle frequency sweep for smooth animation
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 1.2, 
      audioContext.currentTime + duration / 2000
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency, 
      audioContext.currentTime + duration / 1000
    );
    
    // Configure filter for warmth
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(2000, audioContext.currentTime);
    filterNode.Q.setValueAtTime(1, audioContext.currentTime);
    
    // Create smooth envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(volume * 0.7, audioContext.currentTime + 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
    
    // Start and stop
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
    
    // Add subtle reverb effect
    this.addReverbEffect(audioContext, gainNode, duration);
  }

  private addReverbEffect(audioContext: AudioContext, sourceNode: GainNode, duration: number): void {
    try {
      // Create simple reverb using delay
      const delayNode = audioContext.createDelay();
      const feedbackGain = audioContext.createGain();
      const reverbGain = audioContext.createGain();
      
      // Configure reverb
      delayNode.delayTime.setValueAtTime(0.1, audioContext.currentTime);
      feedbackGain.gain.setValueAtTime(0.2, audioContext.currentTime);
      reverbGain.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      // Connect reverb chain
      sourceNode.connect(reverbGain);
      reverbGain.connect(delayNode);
      delayNode.connect(feedbackGain);
      feedbackGain.connect(delayNode);
      delayNode.connect(audioContext.destination);
      
    } catch (error) {
      console.warn('Reverb effect failed:', error);
    }
  }

  // Create bell-like chime sound
  async playChimeSound(): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const audioContext = await this.initAudioContext();
      if (!audioContext) return;

      // Create multiple harmonics for bell-like sound
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
      const duration = 1000;

      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        
        // Different volume for each harmonic
        const volume = 0.05 / (index + 1);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime + index * 0.02);
        oscillator.stop(audioContext.currentTime + duration / 1000);
      });

    } catch (error) {
      console.warn('Chime sound failed:', error);
    }
  }

  // Enable/disable sound
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  // Test sound functionality
  async testSound(): Promise<{ success: boolean; error?: string }> {
    try {
      const audioContext = await this.initAudioContext();
      if (!audioContext) {
        return { success: false, error: 'Audio context not available' };
      }

      console.log('🔊 Tab sound service is working correctly');
      await this.playChimeSound();
      
      return { success: true };
    } catch (error) {
      console.error('❌ Tab sound test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Cleanup
  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export default TabSoundService;