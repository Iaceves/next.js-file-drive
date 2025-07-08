import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";

export function Header(){
    return (
        <div className="border-b py-4 bg-gray-50">
            <div className="items-center container mx-auto justify-between flex">
                <div>File Drive</div>
                <div className="flex gap-2">
                    <OrganizationSwitcher />
                    <UserButton />
                    <SignOutButton>
                        <SignInButton>
                            <Button>Sign In</Button>
                        </SignInButton>
                    </SignOutButton>
                </div>
            </div>

        </div>
    )
}