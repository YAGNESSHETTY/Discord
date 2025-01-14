import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ServerSidebar from "@/components/server/server-sidebar";

const ServerIdLayout = async (
    { children , params } :
    { children : React.ReactNode ; params : {serverId : string } ;} 
) => {
    const profile = await currentProfile() ;
    const {serverId} = await params ;
    if(!profile){
        return redirect('/sign-in') ;
    }

    const server = await db.server.findUnique({
        where : {
            id: serverId ,
            members : {
                some : {
                    profileId : profile.id ,
                }
            }
        }
    }) ;

    if(!server){
        return redirect('/') ;
    }
     
    return ( 
        <div className="h-full">
            <div className="fixed invisible md:visible md:flex h-full w-60 z-20 flex-col inset-y-0">
                <ServerSidebar serverId= {serverId}/>
            </div>

            <main className="h-full md:pl-60">
                {children} 
            </main>

        </div>
     );
}
 
export default ServerIdLayout;