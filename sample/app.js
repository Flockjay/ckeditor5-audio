import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import List from '@ckeditor/ckeditor5-list/src/list';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import AudioToolbar from '../src/audiotoolbar.js';
import Audio from '../src/audio.js';
import AudioUpload from '../src/audioupload.js';
import AudioResize from '../src/audioresize.js';
import AudioStyle from '../src/audiostyle.js';

class AudioUploadAdapter {
    constructor( loader ) {
        this.loader = loader;
    }

    upload() {
        const uploadAudio = async (file) => {
            this.loader.uploaded = false;
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.loader.uploaded = true;
                    resolve({ default: 'http://localhost:8000/feed/files/fj-file-uploads/caa8421f402849/fjfile-84f6fd9ae95401.mp3' });
                }, 2000);
            });
        };

        return this.loader.file.then((file) => uploadAudio(file));
    }

    abort() {
        return Promise.reject();
    }
}

function AudioUploadAdapterPlugin( editor ) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new AudioUploadAdapter(loader);
    };
}

ClassicEditor
    .create( document.querySelector( '#editor' ), {
        plugins: [ Essentials, Paragraph, Bold, Italic, Heading, List, AudioToolbar, Audio, AudioUpload, AudioResize, AudioStyle ],
        extraPlugins: [AudioUploadAdapterPlugin],
        toolbar: [ 'heading', 'bold', 'italic', 'numberedList', 'bulletedList', 'audioUpload' ],
        audio: {
            upload: {
                types: ['mp3'],
                allowMultipleFiles: false,
            },
            styles: [
                'alignLeft', 'alignCenter', 'alignRight'
            ],

            // Configure the available audio resize options.
            resizeOptions: [
                {
                    name: 'audioResize:original',
                    label: 'Original',
                    icon: 'original'
                },
                {
                    name: 'audioResize:50',
                    label: '50',
                    icon: 'medium'
                },
                {
                    name: 'audioResize:75',
                    label: '75',
                    icon: 'large'
                }
            ],

            // You need to configure the audio toolbar, too, so it shows the new style
            // buttons as well as the resize buttons.
            toolbar: [
                'audioStyle:alignLeft', 'audioStyle:alignCenter', 'audioStyle:alignRight',
                '|',
                'audioResize:50',
                'audioResize:75',
                'audioResize:original'
            ]
        }
    } )
    .then( editor => {
        CKEditorInspector.attach( editor );

        window.editor = editor;
    } )
    .catch( error => {
        console.error( error.stack );
    } );
