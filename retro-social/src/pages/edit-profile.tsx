import { useState, useEffect } from "react";
import { useSession } from "@/hooks/use-session";
// 1. Remove the @workspace import and paste these:
const useGetMe = () => ({ data: { username: "user", displayName: "User", bio: "", location: "", interests: "", profileColor: "#00ffff" }, isLoading: false });
const useUpdateProfile = () => ({ mutateAsync: async (data: any) => ({}), isPending: false });
const getGetMeQueryKey = () => ["me"];
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function EditProfile() {
  const { user } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const updateUserMutation = useUpdateUser();

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    location: "",
    interests: "",
    avatarUrl: "",
    profileColor: "#ff00ff",
    profileSong: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        bio: user.bio || "",
        location: user.location || "",
        interests: user.interests || "",
        avatarUrl: user.avatarUrl || "",
        profileColor: user.profileColor || "#ff00ff",
        profileSong: user.profileSong || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updateUserMutation.mutateAsync({
        username: user.username,
        data: formData,
      });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      toast({
        title: "Profile Updated!",
        description: "Your retro presence has been modified.",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Could not save profile.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto w-full"
    >
      <div className="retro-container bg-card p-6 border-2" style={{ borderColor: formData.profileColor }}>
        <h1 className="text-3xl font-display mb-6 text-center border-b-2 pb-2" style={{ color: formData.profileColor, borderBottomColor: formData.profileColor, textShadow: `0 0 5px ${formData.profileColor}` }}>
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="displayName" className="text-primary">Display Name</Label>
              <Input 
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="bg-background rounded-none border-primary"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="avatarUrl" className="text-primary">Avatar Image URL</Label>
              <Input 
                id="avatarUrl"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                className="bg-background rounded-none border-primary"
                placeholder="http://..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bio" className="text-primary">About Me (Bio)</Label>
            <Textarea 
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="bg-background rounded-none border-primary min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="location" className="text-primary">Location</Label>
              <Input 
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="bg-background rounded-none border-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="interests" className="text-primary">Interests</Label>
              <Input 
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                className="bg-background rounded-none border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="profileSong" className="text-primary">Profile Song</Label>
              <Input 
                id="profileSong"
                name="profileSong"
                value={formData.profileSong}
                onChange={handleChange}
                className="bg-background rounded-none border-primary"
                placeholder="Artist - Title"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="profileColor" className="text-primary">Profile Theme Color</Label>
              <div className="flex gap-2 items-center">
                <input 
                  type="color"
                  id="profileColor"
                  name="profileColor"
                  value={formData.profileColor}
                  onChange={handleChange}
                  className="w-12 h-12 bg-transparent border-0 cursor-pointer p-0"
                />
                <span className="text-muted-foreground">{formData.profileColor}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Link href={`/profile/${user.username}`}>
              <Button type="button" variant="outline" className="rounded-none border-primary text-primary hover:bg-primary/20">
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={updateUserMutation.isPending}
              className="rounded-none font-bold tracking-widest uppercase transition-all"
              style={{ backgroundColor: formData.profileColor, color: '#fff' }}
            >
              {updateUserMutation.isPending ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
