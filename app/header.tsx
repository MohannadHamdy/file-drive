import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <div className="border-b p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>File Drive</div>
        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton />
        </div>
      </div>
    </div>
  );
}
