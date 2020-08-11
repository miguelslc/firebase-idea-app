import {createContext} from 'react';
import FirebaseApp from 'firebase/app';
import 'firebase/firestore';

import {firebaseConfig} from './config';

class Firebase {
    constructor(){
        if (!FirebaseApp.apps.length){
            FirebaseApp.initializeApp(firebaseConfig);
            FirebaseApp.firestore()
                .enablePersistence({ synchronizeTabs: true})
                .catch(err =>console.log(err))
        }

        //instanciando variables
        this.db = FirebaseApp.firestore();
        this.ideasCollection = this.db.collection('ideas-react-firebase')
    }
}

const FirebaseContext = createContext(null);

export {Firebase, FirebaseContext, FirebaseApp}