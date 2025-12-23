import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Award, Users, Linkedin, Facebook, Instagram, Send } from "lucide-react";
import { toast } from "sonner";

export default function AdminTeam() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    photoUrl: "",
    experience: "",
    metaBlueprintCertified: 0,
    googleAdsCertified: 0,
    tiktokCertified: 0,
    linkedinUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    telegramUrl: "",
    orderIndex: 0,
    isActive: 1,
  });

  const { data: teamMembers, refetch } = trpc.team.getAll.useQuery();
  const createMutation = trpc.team.create.useMutation();
  const updateMutation = trpc.team.update.useMutation();
  const deleteMutation = trpc.team.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingMember) {
        await updateMutation.mutateAsync({
          id: editingMember.id,
          ...formData,
        });
        toast.success("Члена команди оновлено!");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Члена команди додано!");
      }
      
      refetch();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Помилка при збереженні");
    }
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio || "",
      photoUrl: member.photoUrl || "",
      experience: member.experience || "",
      metaBlueprintCertified: member.metaBlueprintCertified,
      googleAdsCertified: member.googleAdsCertified,
      tiktokCertified: member.tiktokCertified,
      linkedinUrl: member.linkedinUrl || "",
      facebookUrl: member.facebookUrl || "",
      instagramUrl: member.instagramUrl || "",
      telegramUrl: member.telegramUrl || "",
      orderIndex: member.orderIndex,
      isActive: member.isActive,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити цього члена команди?")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Члена команди видалено!");
      refetch();
    } catch (error) {
      toast.error("Помилка при видаленні");
    }
  };

  const resetForm = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      position: "",
      bio: "",
      photoUrl: "",
      experience: "",
      metaBlueprintCertified: 0,
      googleAdsCertified: 0,
      tiktokCertified: 0,
      linkedinUrl: "",
      facebookUrl: "",
      instagramUrl: "",
      telegramUrl: "",
      orderIndex: 0,
      isActive: 1,
    });
  };

  return (
    <div className="p-6 bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Управління командою</h1>
            <p className="text-gray-400">Додавайте та редагуйте членів команди для відображення на сайті</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-black">
                <Plus className="w-4 h-4 mr-2" />
                Додати члена команди
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 text-white border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingMember ? "Редагувати члена команди" : "Додати члена команди"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-white mb-2 block">Ім'я *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Іван Петренко"
                      required
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Посада *</Label>
                    <Input
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Performance Marketing Manager"
                      required
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Досвід</Label>
                    <Input
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="5+ років досвіду"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">Біографія</Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Короткий опис досвіду та досягнень..."
                      rows={3}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">URL фото</Label>
                    <Input
                      value={formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      placeholder="https://example.com/photo.jpg"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Завантажте фото на S3 або вставте URL</p>
                  </div>
                </div>

                {/* Certifications */}
                <div className="space-y-3 p-4 bg-zinc-800/50 rounded-lg">
                  <Label className="text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#FFD93D]" />
                    Сертифікації
                  </Label>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="meta"
                      checked={formData.metaBlueprintCertified === 1}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, metaBlueprintCertified: checked ? 1 : 0 })
                      }
                    />
                    <label htmlFor="meta" className="text-sm text-gray-300 cursor-pointer">
                      Meta Blueprint Certified
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="google"
                      checked={formData.googleAdsCertified === 1}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, googleAdsCertified: checked ? 1 : 0 })
                      }
                    />
                    <label htmlFor="google" className="text-sm text-gray-300 cursor-pointer">
                      Google Ads Certified
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tiktok"
                      checked={formData.tiktokCertified === 1}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, tiktokCertified: checked ? 1 : 0 })
                      }
                    />
                    <label htmlFor="tiktok" className="text-sm text-gray-300 cursor-pointer">
                      TikTok Certified
                    </label>
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-3 p-4 bg-zinc-800/50 rounded-lg">
                  <Label className="text-white">Соціальні мережі</Label>
                  
                  <div>
                    <Label className="text-gray-400 text-xs mb-1 flex items-center gap-2">
                      <Linkedin className="w-3 h-3" /> LinkedIn
                    </Label>
                    <Input
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-400 text-xs mb-1 flex items-center gap-2">
                      <Facebook className="w-3 h-3" /> Facebook
                    </Label>
                    <Input
                      value={formData.facebookUrl}
                      onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                      placeholder="https://facebook.com/username"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-400 text-xs mb-1 flex items-center gap-2">
                      <Instagram className="w-3 h-3" /> Instagram
                    </Label>
                    <Input
                      value={formData.instagramUrl}
                      onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                      placeholder="https://instagram.com/username"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-400 text-xs mb-1 flex items-center gap-2">
                      <Send className="w-3 h-3" /> Telegram
                    </Label>
                    <Input
                      value={formData.telegramUrl}
                      onChange={(e) => setFormData({ ...formData, telegramUrl: e.target.value })}
                      placeholder="https://t.me/username"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>

                {/* Display Settings */}
                <div className="space-y-3 p-4 bg-zinc-800/50 rounded-lg">
                  <Label className="text-white">Налаштування відображення</Label>
                  
                  <div>
                    <Label className="text-gray-400 text-xs mb-1">Порядок відображення</Label>
                    <Input
                      type="number"
                      value={formData.orderIndex}
                      onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Менше число = вище в списку</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="active"
                      checked={formData.isActive === 1}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, isActive: checked ? 1 : 0 })
                      }
                    />
                    <label htmlFor="active" className="text-sm text-gray-300 cursor-pointer">
                      Відображати на сайті
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-black">
                    {editingMember ? "Зберегти зміни" : "Додати"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                    className="border-zinc-700 text-white hover:bg-zinc-800"
                  >
                    Скасувати
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Team Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers?.map((member) => (
            <div
              key={member.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-[#FFD93D]/50 transition-all"
            >
              {/* Photo */}
              <div className="relative h-48 bg-zinc-800">
                {member.photoUrl ? (
                  <img 
                    src={member.photoUrl} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-zinc-700" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-mono ${
                    member.isActive === 1 
                      ? "bg-green-500/20 text-green-400 border border-green-500/50" 
                      : "bg-red-500/20 text-red-400 border border-red-500/50"
                  }`}>
                    {member.isActive === 1 ? "ACTIVE" : "HIDDEN"}
                  </span>
                </div>

                {/* Certifications */}
                <div className="absolute top-3 right-3 flex gap-1">
                  {member.metaBlueprintCertified === 1 && (
                    <div title="Meta Blueprint">
                      <Award className="w-4 h-4 text-[#FFD93D]" />
                    </div>
                  )}
                  {member.googleAdsCertified === 1 && (
                    <div title="Google Ads">
                      <Award className="w-4 h-4 text-[#00F0FF]" />
                    </div>
                  )}
                  {member.tiktokCertified === 1 && (
                    <div title="TikTok">
                      <Award className="w-4 h-4 text-purple-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                <p className="text-[#FFD93D] text-sm mb-2">{member.position}</p>
                {member.experience && (
                  <p className="text-gray-400 text-xs mb-3">{member.experience}</p>
                )}
                
                {/* Social Links Preview */}
                <div className="flex gap-2 mb-3">
                  {member.linkedinUrl && <Linkedin className="w-4 h-4 text-gray-500" />}
                  {member.facebookUrl && <Facebook className="w-4 h-4 text-gray-500" />}
                  {member.instagramUrl && <Instagram className="w-4 h-4 text-gray-500" />}
                  {member.telegramUrl && <Send className="w-4 h-4 text-gray-500" />}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-zinc-800">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(member)}
                    className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Редагувати
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(member.id)}
                    className="border-red-900 text-red-400 hover:bg-red-950"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {teamMembers?.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Поки що немає членів команди</p>
            <Button 
              onClick={() => setDialogOpen(true)}
              className="bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Додати першого члена
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
