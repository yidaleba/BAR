import UserInfoForm from '@/components/user-info-form';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <UserInfoForm />
    </div>
  );
}
