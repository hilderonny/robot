package hilderonny.voicelistener;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.CompoundButton;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ToggleButton;

import java.util.ArrayList;

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
    private TextView returnedText;
    private ToggleButton toggleButton;
    private SpeechRecognizer speech = null;
    private Intent recognizerIntent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        returnedText = findViewById(R.id.textView1);
        toggleButton = findViewById(R.id.toggleButton1);

        speech = SpeechRecognizer.createSpeechRecognizer(this);
        speech.setRecognitionListener(this);

        recognizerIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE,"de");
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        recognizerIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3);

        toggleButton.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean isChecked) {
                if (isChecked) {
                    ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.RECORD_AUDIO}, REQUEST_RECORD_PERMISSION);
                } else {
                    speech.stopListening();
                }
            }
        });

    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_RECORD_PERMISSION) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                speech.startListening(recognizerIntent);
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
    public void onEndOfSpeech() {
        toggleButton.setChecked(false);
    }

    @Override
    public void onResults(Bundle results) {
        ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        StringBuilder sb = new StringBuilder();
        if (matches != null) for (String result : matches) sb.append(result).append("\n");
        returnedText.setText(sb.toString());
    }

    @Override public void onBeginningOfSpeech() { }
    @Override public void onBufferReceived(byte[] bytes) { }
    @Override public void onError(int i) { }
    @Override public void onEvent(int i, Bundle bundle) { }
    @Override public void onPartialResults(Bundle bundle) { }
    @Override public void onReadyForSpeech(Bundle bundle) { }
    @Override public void onRmsChanged(float rmsdB) { }

}
