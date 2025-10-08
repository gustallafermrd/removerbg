from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
from rembg import remove
from PIL import Image
import io
import base64
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)


@app.route('/')
def index():
    # Serve the frontend HTML (English-only version)
    return render_template('index.html')


@app.route('/api/remove-background', methods=['POST'])
def remove_background():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        file = request.files['image']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        input_image = Image.open(file.stream)

        output_image = remove(input_image)

        img_io = io.BytesIO()
        output_image.save(img_io, 'PNG')
        img_io.seek(0)

        img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')

        return jsonify({
            'success': True,
            'image': f'data:image/png;base64,{img_base64}'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    HOST = os.environ.get('HOST', '127.0.0.1')
    try:
        PORT = int(os.environ.get('PORT', 5003))
    except ValueError:
        PORT = 5003
    # Use the configured host/port so we can start on a different port if the default is in use
    app.run(debug=True, host=HOST, port=PORT)
