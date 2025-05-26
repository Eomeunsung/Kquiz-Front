import {Quill} from 'quill';
import {ImageActions} from "@xeger/quill-image-actions";
import {ImageFormats} from "@xeger/quill-image-formats";
import ImageResize from 'quill-image-resize-module-react';
// Quill.register('modules/imageActions', ImageActions);
// Quill.register('modules/imageFormats', ImageFormats);
Quill.register('modules/imageResize', ImageResize);
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
    imageResize: {
        // Resize 모듈만 쓸 경우
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
        // (원한다면 아래 옵션으로 min/max 크기 제한도 넣을 수 있습니다)
        // handleStyles: {
        //   backgroundColor: 'black',
        //   border: 'none',
        //   color: 'white'
        // }
    },
    // imageActions: {},
    // imageFormats: {}
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