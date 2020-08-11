import React, {useState, useEffect, useRef} from 'react';
import Idea from './Idea';
import {withFirebase} from '../firebase/withFirebase';
import './App.less';

const App = props =>{
    const {ideasCollection} = props.firebase;
    const ideasContainer = useRef(null);
    const [idea, setIdeaInput] = useState('');
    const [ideas, setIdeas] = useState('');

    useEffect(()=>{
        const unsuscribe = ideasCollection
            .orderBy('timestamp', 'desc')
            .onSnapshot(({docs})=>{
                const ideasFromDB=[]

                docs.forEach (doc =>{
                    const details = {
                        id: doc.id,
                        content: doc.data().idea,
                        timestamp: doc.data().timestamp
                    }

                    ideasFromDB.push(details)
                })
                setIdeas(ideasFromDB);
            })
            return () => unsuscribe()
    },[])

    const onIdeaDelete = event => {
        const {id} = event.target
        ideasCollection.doc(id).delete()
    }

    const ondIdeaAdd = event => {
        event.preventDefault();

        if(!idea.trim().length)return

        setIdeaInput('');

        //scroll to Top of container
        ideasContainer.current.scrollTop = 0;

        ideasCollection.add ({
            idea,
            timestamp: new Date()
        }) 
    }

    const renderIdeas = () => {
        if (!ideas.length)
            return <h2 className="app__content__no-idea">Agregar una Idea..</h2>
    
        return ideas.map (idea =>(
            <Idea key={idea.id} idea={idea} onDelete={onIdeaDelete} />
        ))
    }

    return (
        <div className="app">
            <header className="app__header">
                <h1 className="app__header__h1">Idea Box</h1>
            </header>

            <section ref={ideasContainer} className="app_content">
                {renderIdeas()}
            </section>

            <form className="app__footer" onSubmit={ondIdeaAdd}>
                <input
                    type="text"
                    className="app__footer__input"
                    placeholder="Agregar una nueva Idea"
                    value={idea}
                    onChange={e => setIdeaInput(e.target.value)}
                />
                <button type="submit" className="app__btn app__footer__submit-btn">
                    +
                </button>
            </form>
        </div>
    )
}

export default withFirebase(App);