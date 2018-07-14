//EVERYTHING IS PLACED INSIDE A DOMContentLoaded EVENT SO THAT WHEN
//WE getElementById, THE ELEMENTS ARE LOADED & AVAILABLE
document.addEventListener("DOMContentLoaded", function(event) {
  //SET UP AUDIO CONTEXT
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  //PROCESSING CHAIN
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  //CURRENT WAVEFORM OSCILLATOR WILL USE
  let waveform = 'sawtooth'

  //OBJECT FOR STORING ACTIVE NOTES
  const activeOscillators = {};

  //KEYCODE TO MUSICAL FREQUENCY CONVERSION
  const keyboardFrequencyMap = {
    '90': 261.625565300598634,  //Z - C
    '83': 277.182630976872096, //S - C#
    '88': 293.664767917407560,  //X - D
    '68': 311.126983722080910, //D - D#
    '67': 329.627556912869929,  //C - E
    '86': 349.228231433003884,  //V - F
    '71': 369.994422711634398, //G - F#
    '66': 391.995435981749294,  //B - G
    '72': 415.304697579945138, //H - G#
    '78': 440.000000000000000,  //N - A
    '74': 466.163761518089916, //J - A#
    '77': 493.883301256124111,  //M - B
    '81': 523.251130601197269,  //Q - C
    '50': 554.365261953744192, //2 - C#
    '87': 587.329535834815120,  //W - D
    '51': 622.253967444161821, //3 - D#
    '69': 659.255113825739859,  //E - E
    '82': 698.456462866007768,  //R - F
    '53': 739.988845423268797, //5 - F#
    '84': 783.990871963498588,  //T - G
    '54': 830.609395159890277, //6 - G#
    '89': 880.000000000000000,  //Y - A
    '55': 932.327523036179832, //7 - A#
    '85': 987.766602512248223,  //U - B
  }

  //CONNECTIONS
  gain.connect(filter);
  filter.connect(audioCtx.destination);

  //EVENT LISTENERS FOR SYNTH PARAMETER INTERFACE
  const waveformControl = document.getElementById('waveform')
  waveformControl.addEventListener('change', function(event) {
    waveform = event.target.value
  });

  const gainControl = document.getElementById('gain')
  gainControl.addEventListener('change', function(event) {
    gain.gain.setValueAtTime(event.target.value, audioCtx.currentTime)
  });

  const filterTypeControl = document.getElementById('filterType')
  filterTypeControl.addEventListener('change', function(event) {
    filter.type = event.target.value
  });

  const filterFrequencyControl = document.getElementById('filterFrequency')
  filterFrequencyControl.addEventListener('change', function(event) {
    filter.frequency.setValueAtTime(event.target.value, audioCtx.currentTime)
  });

  //EVENT LISTENERS FOR MUSICAL KEYBOARD
  window.addEventListener('keydown', keyDown, false);
  window.addEventListener('keyup', keyUp, false);

  //CALLED ON KEYDOWN EVENT - CALLS PLAYNOTE IF KEY PRESSED IS ON MUSICAL
  //KEYBOARD && THAT KEY IS NOT CURRENTLY ACTIVE
  function keyDown(event) {
    const key = (event.detail || event.which).toString();
    if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
      playNote(key);
    }
  }

  //STOPS & DELETES OSCILLATOR ON KEY RELEASE IF KEY RELEASED IS ON MUSICAL
  //KEYBOARD && THAT KEY IS CURRENTLY ACTIVE
  function keyUp(event) {
    const key = (event.detail || event.which).toString();
    if (keyboardFrequencyMap[key] && activeOscillators[key]) {
      activeOscillators[key].stop();
      delete activeOscillators[key];
    }
  }

  //HANDLES CREATION & STORING OF OSCILLATORS
  function playNote(key) {
    const osc = audioCtx.createOscillator();
    osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime)
    osc.type = waveform
    activeOscillators[key] = osc
    activeOscillators[key].connect(gain)
    activeOscillators[key].start();
  }

});
