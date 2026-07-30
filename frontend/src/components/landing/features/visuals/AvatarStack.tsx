export default function AvatarStack() {
  const users = [
    { name: "R", color: "from-indigo-500 to-violet-500" },
    { name: "P", color: "from-cyan-500 to-blue-500" },
    { name: "A", color: "from-emerald-500 to-green-500" },
  ];

  return (
    <div className="absolute left-6 top-6 flex items-center">
      {users.map((user, index) => (
        <div
          key={user.name}
          className={`
            -ml-2
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border-2
            border-background
            bg-gradient-to-br
            ${user.color}
            text-sm
            font-bold
            text-white
            shadow-lg
          `}
          style={{ zIndex: users.length - index }}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}
