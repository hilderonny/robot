var webcam = require('webcam-http-streaming');
var encoder = {
    command: 'avconv',
    flags(webcam) {
        //return `-f video4linux2 -framerate 25 -input_format mjpeg -video_size 640x480 -i ${webcam} -an -f webm -deadline realtime pipe:1`;
        return `-f video4linux2 -framerate 25 -input_format mjpeg -video_size 640x480 -i ${webcam} -an -f webm -s 640x480 -b:v 1000k -bf 0 -deadline realtime pipe:1`;
    }
};
var server = webcam.createHTTPStreamingServer({
    encoder: encoder,
    additionalEndpoints: {
        '/': (req, res, reqUrl) => { res.end('<!DOCTYPE html><html><body><video src="/webcam?webcam=/dev/video0" autoplay/></body></html>'); }
    }
}).listen(8200);
//var videoStream = webcam.streamWebcam('/dev/video0', encoder);
