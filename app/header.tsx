import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <div className="border-b p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>File Drive</div>
        <div className="flex gap-2">
          <SignedIn>
            <OrganizationSwitcher />
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button>Sign in</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
