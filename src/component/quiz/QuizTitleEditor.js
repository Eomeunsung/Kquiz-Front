import React, {useState} from 'react';
import "./../../css/QuizTitleEditor.css"
function QuizTitleEditor({title, close, save}) {
    const [titleWrite,setTitleWrite] = useState(title);

    return (
        <div className="title-editor-overlay" onClick={close}>
            <div className="title-editor-modal" onClick={e => e.stopPropagation()}>
                <h3>제목 수정</h3>
                <input
                    value={titleWrite}
                    onChange={(e) => setTitleWrite(e.target.value)}
                    autoFocus
                />
                <div className="title-button-grid">
                    <button onClick={() => save(titleWrite)}>저장</button>
                    <button onClick={close}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default QuizTitleEditor;