import { RootStore } from "./rootStore";
import { observable, action, runInAction } from "mobx";


export default class ModalStore
{
    rootStore: RootStore;

    constructor(rootStore: RootStore)
    {
        this.rootStore = rootStore;
    }

    @observable.shallow modal = {
        open: false,
        body: null
    };

    @action openModal = (content: any) => 
    {
        runInAction('Open Modal', () => {
            this.modal.open = true;
            this.modal.body = content;
        })
        
    }

    @action clodeModal = () =>
    {
        runInAction('Close Modal', () => {
            this.modal.open = false;
            this.modal.body = null;
        })
        
    }
    

}