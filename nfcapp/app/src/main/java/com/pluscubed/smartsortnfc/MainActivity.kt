package com.pluscubed.smartsortnfc

import android.content.Intent
import android.net.Uri
import android.nfc.NdefMessage
import android.nfc.NfcAdapter
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        if (NfcAdapter.ACTION_TECH_DISCOVERED == intent.action) {
            Log.d("Main", "discovered")

            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("exp://expo.io/@pluscubed/smart-sort?scan=true")))
        }
    }
}
