import { Sidebar } from "../components/Sidebar"; // reutiliza tu Sidebar existente
import { CreatePostForm } from "../components/create-post/CreatePostForm";


export default function CreatePostPage() {
return (
<div className="min-h-dvh grid grid-cols-[240px_1fr] bg-slate-100">
<Sidebar active="marketplace" />


<div className="grid grid-rows-[60px_1fr] min-w-0">
<header className="bg-white/60 grid grid-cols-[1fr_auto] items-center px-4 py-2 border-b">
<div />
<div className="size-9 rounded-full bg-gray-300" title="Perfil" />
</header>


<main className="px-4 pt-4 pb-8 mt-6 min-w-0">
<CreatePostForm />
</main>
</div>
</div>
);
}