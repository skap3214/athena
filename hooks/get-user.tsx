import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const getUser = () => {
  const supabase = createClient();
  const [userId, setUserId] = useState<User | null | undefined>(undefined);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user !== null) {
      setUserId(user);
    } else {
      setUserId(null);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return userId;
};

export default getUser;
