import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed, reaction } from "mobx";
import { IProfile, IPhoto, IUserActivity } from "../models/profile";
import { toast } from "react-toastify";
import agent from "../api/agent";

export default class ProfileStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore)
    {
        this.rootStore = rootStore;

        reaction(
            () => this.activeTab,
            activeTab =>{
                if(activeTab === 3 || activeTab === 4)
                {
                    const predicate = activeTab === 3 ? "followers" : "following";
                    this.loadFollowings(predicate)
                }else{
                    this.followings = [];
                }
            }
        )

    }

    @observable profile: IProfile | null = null;
    @observable followings : IProfile[] = [];
    @observable activeTab: number = 0;

    @observable loadingProfile: boolean = true;
    @observable loadingProfilePhoto = false;
    @observable loadingDelete = false;
    @observable uploadingPhoto = false;
    @observable updateLoading = false;
    @observable followLoading = false;
    @observable loading = false;
    @observable userActivities: IUserActivity[] = [];
    @observable loadingActivities = false;

    @action loadUserActivities = async (username: string, predicate?: string) =>
    {
        this.loadingActivities = true;

        try{
            const activities = await agent.Profiles.listActivities(username, predicate!);
            runInAction(() => {
                this.userActivities = activities;
                this.loadingActivities = false;
            });
        }catch(error){
            toast.error('Problem loading activities');
            runInAction(() => {
                this.loadingActivities = false;
            });
        }

    }

    @computed get isCurrentUser() {
        if (this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.userName;
        } else {
            return false;
        }
    }

    @computed get getActiveTab()
    {
        return this.activeTab;
    }

    @action setActiveTab = (activeIndex: number) => {
        this.activeTab = activeIndex;
    }

    @action loadProfile = async (username: string) => {
        
        try{
            const profile = await agent.Profiles.get(username);
            runInAction('Loading Profile', () => {
                this.profile = profile;
                this.loadingProfile = false;
            });
        }
        catch(error)
        {
            runInAction('Loading Profile Error', () => {
                this.loadingProfile = false;
            });
            
            toast.error("Problem loading profile");

        }
    }

    @action setMainPhoto = async (photo: IPhoto) => {
        this.loadingProfilePhoto = true;
        try{
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction('Set Main Photo', () => {
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find(a => a.isMain)!.isMain = false;
                this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                this.loadingProfilePhoto = false;
            });

        }catch(error){
            runInAction("Set Main Photo Error", () => {
                this.loadingProfilePhoto = false;
            })
            toast.error("Problem setting main photo!");
        }
    }

    @action deletePhoto = async(photo: IPhoto) => {
        this.loadingDelete = true;
        try{
            await agent.Profiles.deletePhoto(photo.id);
            runInAction('Delete Photo', () => {
                this.profile!.photos = this.profile!.photos.filter(a => a.id !== photo.id);
                this.loadingDelete = false;
            });
        }catch(error){
            runInAction("Delete Photo Error", () => {
                this.loadingDelete = false;
            })
            toast.error("Problem deleting photo!");
        }
    }

    @action uploadPhoto = async(file: Blob) => {
        this.uploadingPhoto = true;
        try{
            const photo = await agent.Profiles.uploadPhoto(file);
            runInAction('Uploading Photo', () => {
                if(this.profile){
                    this.profile.photos.push(photo);
                    if(photo.isMain && this.rootStore.userStore.user ){
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url;
                    }
                }
                this.uploadingPhoto = false;
            })
        }catch(error){
            runInAction('Error Uploading Photo', () => {
                this.uploadingPhoto = false;
            });
            toast.error("Problem uploading photo!");
            console.log(error);
        }
    }

    @action updateProfile = async (profile: Partial<IProfile>) => {
        this.updateLoading = true;
        try{
            await agent.Profiles.updateBio(profile);
            runInAction(() => {
                if(profile.displayName !== this.rootStore.userStore.user!.displayName){
                    this.rootStore.userStore.user!.displayName = profile.displayName!
                }
                this.profile = {...this.profile!, ...profile};
            });
        }catch(error){
            runInAction( () => {
                this.updateLoading = false;
            });
            toast.error("Problem editin Profile");
            console.log(error);
        }
    }

    @action follow = async (username: string) => {
        this.followLoading = true;
        try{

            await agent.Profiles.follow(username);
            runInAction(() => {

                this.profile!.follower = true;
                this.profile!.followersCount++;
                this.followLoading = false;
            });

        }catch(error){
            toast.error("Problem following the user!");
            runInAction(() => {
                this.followLoading = false;
            })
            console.log(error);
        }
    }

    @action unfollow = async (username: string) => {
        this.followLoading = true;
        try{

            await agent.Profiles.unfollow(username);
            runInAction(() => {

                this.profile!.follower = false;
                this.profile!.followersCount--;
                this.followLoading = false;
            });

        }catch(error){
            toast.error("Problem unfollowing the user!");
            runInAction(() => {
                this.followLoading = false;
            })
            console.log(error);
        }
    }

    @action loadFollowings = async (predicate: string) => {
        this.loading = true;
        try{
            const profiles = await agent.Profiles.listFollowings(this.profile!.userName, predicate);

            runInAction(() => {
                this.followings = profiles;
                this.loading = false;
            })

        }catch(error){
            runInAction(() => {
                this.loading = false;
            })
            toast.error("Problem loading followings")
            console.log(error);
        }
    }

}