#!/bin/bash

# META quizzes
cat > MetaRepair.tsx << 'EOFILE'
import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function MetaRepair() {
  return <Quiz config={quizzes["meta-repair"]!} />;
}
EOFILE

cat > MetaEcom.tsx << 'EOFILE'
import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function MetaEcom() {
  return <Quiz config={quizzes["meta-ecom"]!} />;
}
EOFILE

cat > MetaProducts.tsx << 'EOFILE'
import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function MetaProducts() {
  return <Quiz config={quizzes["meta-products"]!} />;
}
EOFILE

cat > MetaTelegram.tsx << 'EOFILE'
import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function MetaTelegram() {
  return <Quiz config={quizzes["meta-telegram"]!} />;
}
EOFILE

# GOOGLE quizzes
cat > GoogleFurniture.tsx << 'EOFILE'
import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function GoogleFurniture() {
  return <Quiz config={quizzes["google-furniture"]!} />;
}
EOFILE

cat > GoogleRepair.tsx << 'EOFILE'
import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function GoogleRepair() {
  return <Quiz config={quizzes["google-repair"]!} />;
}
EOFILE

cat > GoogleEcom.tsx << 'EOFILE'
import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function GoogleEcom() {
  return <Quiz config={quizzes["google-ecom"]!} />;
}
EOFILE

cat > GoogleProducts.tsx << 'EOFILE'
import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function GoogleProducts() {
  return <Quiz config={quizzes["google-products"]!} />;
}
EOFILE

cat > GoogleTelegram.tsx << 'EOFILE'
import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function GoogleTelegram() {
  return <Quiz config={quizzes["google-telegram"]!} />;
}
EOFILE

echo "All quiz pages created successfully!"
