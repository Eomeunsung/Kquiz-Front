
import {Quill} from 'react-quill';
import {ImageActions} from "@xeger/quill-image-actions";
import {ImageFormats} from "@xeger/quill-image-formats";
Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);

export const toolbarOptions = {
    toolbar:[
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],
        [{'direction': 'rtl'}],                         // text direction

        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': []}],
        [{'align': []}],
    ],
    imageActions: {},
    imageFormats: {}
};

export const formats = [
    'align',
    'background',
    'blockquote',
    'bold',
    'code-block',
    'color',
    'float',
    'font',
    'header',
    'height',
    'image',
    'italic',
    'link',
    'script',
    'strike',
    'size',
    'underline',
    'width',
    'image',
]
