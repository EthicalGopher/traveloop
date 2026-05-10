import { PenTool, CheckSquare, List, Image as ImageIcon } from "lucide-react";

export function Notes() {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-surface-background h-full overflow-hidden">
      <div className="p-6 md:p-8 flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto w-full">
           <header className="mb-8">
             <h1 className="font-headline text-4xl font-bold text-text-primary mb-2">Trip Notes</h1>
             <p className="font-body text-base text-text-secondary">Capture your thoughts, ideas, and checklists.</p>
           </header>
           
           <div className="bg-surface-canvas border border-border-subtle rounded-xl p-6 shadow-sm mb-6">
              <input className="w-full text-2xl font-title font-medium text-on-surface focus:outline-none mb-4 placeholder-text-secondary bg-transparent" placeholder="Note Title..." type="text" defaultValue="Packing List for Paris" />
              <div className="space-y-3 mb-6">
                 <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 rounded border-border-subtle text-primary focus:ring-primary" checked readOnly/>
                    <span className="font-body text-base text-on-surface line-through opacity-70">Passports & Visas</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 rounded border-border-subtle text-primary focus:ring-primary" />
                    <span className="font-body text-base text-on-surface">Travel Adapters</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 rounded border-border-subtle text-primary focus:ring-primary" />
                    <span className="font-body text-base text-on-surface">Comfortable Walking Shoes</span>
                 </div>
              </div>
              <div className="flex items-center gap-4 border-t border-border-subtle pt-4 text-text-secondary">
                 <button className="p-2 hover:bg-surface-container rounded-lg transition-colors"><PenTool className="w-5 h-5" /></button>
                 <button className="p-2 hover:bg-surface-container rounded-lg transition-colors"><CheckSquare className="w-5 h-5" /></button>
                 <button className="p-2 hover:bg-surface-container rounded-lg transition-colors"><List className="w-5 h-5" /></button>
                 <button className="p-2 hover:bg-surface-container rounded-lg transition-colors"><ImageIcon className="w-5 h-5" /></button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              <div className="bg-surface-canvas border border-border-subtle rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-48">
                 <h3 className="font-title text-xl font-medium text-on-surface mb-2">Restaurant Recommendations</h3>
                 <p className="font-body text-sm text-on-surface-variant flex-1 line-clamp-4">
                   - Le Relais de l'Entrecôte (Steak frites, long lines so go early)<br/>
                   - Septime (Need to book 3 weeks in advance)<br/>
                   - L'As du Fallafel (Marais area)
                 </p>
                 <span className="font-label text-[11px] text-text-secondary mt-2">Edited 2d ago</span>
              </div>
              
              <div className="bg-surface-container-low border border-border-subtle border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container cursor-pointer transition-colors h-48">
                 <PenTool className="w-8 h-8 mb-3 text-text-secondary" />
                 <span className="font-body text-base font-medium">Create New Note</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
export default Notes;
