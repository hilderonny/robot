package hilderonny.voicelistener;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.AudioManager;
import android.os.Handler;
import android.os.Looper;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Locale;

/**
 * Einfache Sprache-zu-Text-Anwendung, die auf Knopfdruck lokal (ohne Internetverbindung)
 * Spracherkennung durchführt und den erkannten Text anzeigt.
 * To get this to work, on phone do following:
 * 1. Goto “Language & input” in settings
 * 2. Tap on “Voice Search”
 * 3. Tap on “Offline speech recognition”
 * 4. Select and download the desired package
 */
public class MainActivity extends AppCompatActivity implements RecognitionListener {

    private static final int REQUEST_RECORD_PERMISSION = 100;
    private SpeechRecognizer speech = null;
    private Intent recognizerIntent;
    private TextToSpeech tts;

    // Speak text and trigger callback onUtteranceCompleted() when finished, see https://stackoverflow.com/a/4659154/5964970
    private void speak(String text) {
        if (tts != null) {
            HashMap<String, String> myHashAlarm = new HashMap<>();
            myHashAlarm.put(TextToSpeech.Engine.KEY_PARAM_STREAM, String.valueOf(AudioManager.STREAM_ALARM));
            myHashAlarm.put(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, "READY SPOKEN");
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, myHashAlarm);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        speech = SpeechRecognizer.createSpeechRecognizer(this);
        speech.setRecognitionListener(this);

        recognizerIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE,"de");
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3);

        tts = new TextToSpeech(getApplicationContext(), new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                if (status == TextToSpeech.SUCCESS){
                    // At initialization request permissions. This triggers speaking "Bin bereit" which causes onUtteranceCompleted() to be called which starts listening
                    ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.RECORD_AUDIO}, REQUEST_RECORD_PERMISSION);
                    tts.setLanguage(Locale.GERMAN);
                    // Callback after finished speaking. Start listening immediately
                    tts.setOnUtteranceCompletedListener(new TextToSpeech.OnUtteranceCompletedListener() {
                        @Override
                        public void onUtteranceCompleted(String s) {
                            // Run in main thread, see https://stackoverflow.com/a/48891290/5964970
                            new Handler(Looper.getMainLooper()).post(new Runnable() {
                                @Override
                                public void run() {
                                    speech.startListening(recognizerIntent);
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_RECORD_PERMISSION) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Trigger speak-hear-loop
                speak("Bin bereit.");
            } else {
                Toast.makeText(MainActivity.this, "Permission Denied!", Toast.LENGTH_SHORT).show();
            }
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        if (speech != null) speech.destroy();
    }

    @Override
    public void onResults(Bundle results) {
        ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        if (matches != null && matches.size() > 0) {
            String text = matches.get(0);
            // Speak out listened text which triggers re-listening
            speak(text);
        }
    }

    @Override public void onBeginningOfSpeech() { }
    @Override public void onBufferReceived(byte[] bytes) { }
    @Override public void onEndOfSpeech() { }
    @Override public void onError(int i) { }
    @Override public void onEvent(int i, Bundle bundle) { }
    @Override public void onPartialResults(Bundle bundle) { }
    @Override public void onReadyForSpeech(Bundle bundle) { }
    @Override public void onRmsChanged(float rmsdB) { }

}
