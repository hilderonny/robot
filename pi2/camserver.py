import cv2
from flask import Flask, render_template, Response
import sys

class VideoCamera(object):


    def __init__(self):
        self.w = 800
        self.h = 600
        self.lp = 134
        self.tp = 157
        self.rp = self.w - 175
        self.bp = self.h - 108
        self.video = cv2.VideoCapture(-1)
        self.video.set(3,self.w)
        self.video.set(4,self.h)
    
    def __del__(self):
        self.video.release()
    
    def get_frame(self):
        success, image = self.video.read()
        cropped = image[self.tp:self.bp, self.lp:self.rp]
        ret, jpeg = cv2.imencode('.jpg', cropped, [cv2.IMWRITE_JPEG_QUALITY, 50])
        return jpeg.tostring()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/test/')
def test():
    return render_template('test.html')

def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen(VideoCamera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True,port=8080)
