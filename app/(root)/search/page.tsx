import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import Searchbar from "@/app/components/shared/Searchbar";
import UserCard from "@/app/components/cards/UserCard";
import Pagination from "@/app/components/shared/Pagination";



async function Page({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) {
  const params = await searchParams;
  
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchUsers({
    userId: user.id,
    searchString: params.q,
    pageNumber: params?.page ? +params.page : 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className='head-text mb-10'>Search</h1>

      <Searchbar routeType='search' />

      <div className='mt-14 flex flex-col gap-9'>
        {result.users.length === 0 ? (
          <p className='no-result'>No Result</p>
        ) : (
          <>
            {result.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType='User'
              />
            ))}
          </>
        )}
      </div>

      <Pagination
        path='search'
        pageNumber={params?.page ? +params.page : 1}
        isNext={result.isNext}
      />
    </section>
  );
}

export default Page;