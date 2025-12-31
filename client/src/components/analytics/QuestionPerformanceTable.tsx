import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface QuestionPerformance {
  questionNumber: number;
  questionText: string;
  questionType: string;
  views: number;
  answers: number;
  answerRate: number;
  avgTime: number;
  dropOffRate: number;
}

interface QuestionPerformanceTableProps {
  data: QuestionPerformance[];
}

export function QuestionPerformanceTable({ data }: QuestionPerformanceTableProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPerformanceBadge = (answerRate: number) => {
    if (answerRate >= 90) return <Badge className="bg-green-500">Відмінно</Badge>;
    if (answerRate >= 75) return <Badge className="bg-blue-500">Добре</Badge>;
    if (answerRate >= 60) return <Badge className="bg-yellow-500">Середнє</Badge>;
    return <Badge className="bg-red-500">Погано</Badge>;
  };

  const getDropOffIcon = (dropOffRate: number) => {
    if (dropOffRate > 20) return <ArrowUp className="h-4 w-4 text-red-500" />;
    if (dropOffRate > 10) return <Minus className="h-4 w-4 text-yellow-500" />;
    return <ArrowDown className="h-4 w-4 text-green-500" />;
  };

  const questionTypeLabels: Record<string, string> = {
    single_choice: "Один варіант",
    multiple_choice: "Кілька варіантів",
    text_input: "Текст",
    textarea: "Довгий текст",
    slider: "Слайдер",
    rating: "Рейтинг",
    file_upload: "Файл",
    email: "Email",
    phone: "Телефон",
    image_choice: "Вибір з картинками",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Продуктивність питань</CardTitle>
        <CardDescription>
          Детальна статистика по кожному питанню
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-zinc-700">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-zinc-800/50">
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead className="min-w-[300px]">Питання</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead className="text-right">Перегляди</TableHead>
                <TableHead className="text-right">Відповіді</TableHead>
                <TableHead className="text-right">% Відповідей</TableHead>
                <TableHead className="text-right">Серед. час</TableHead>
                <TableHead className="text-right">Відвал</TableHead>
                <TableHead>Оцінка</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((question) => (
                <TableRow key={question.questionNumber} className="hover:bg-zinc-800/30">
                  <TableCell className="font-medium">{question.questionNumber}</TableCell>
                  <TableCell>
                    <div className="max-w-md truncate" title={question.questionText}>
                      {question.questionText}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-zinc-400">
                      {questionTypeLabels[question.questionType] || question.questionType}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{question.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{question.answers.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span className={question.answerRate >= 75 ? "text-green-500" : question.answerRate >= 60 ? "text-yellow-500" : "text-red-500"}>
                      {question.answerRate.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-zinc-300">
                    {formatTime(question.avgTime)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getDropOffIcon(question.dropOffRate)}
                      <span className={question.dropOffRate > 20 ? "text-red-500" : question.dropOffRate > 10 ? "text-yellow-500" : "text-green-500"}>
                        {question.dropOffRate.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getPerformanceBadge(question.answerRate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary stats */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700">
            <p className="text-xs text-zinc-400 mb-1">Всього питань</p>
            <p className="text-2xl font-bold text-white">{data.length}</p>
          </div>
          <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700">
            <p className="text-xs text-zinc-400 mb-1">Середня відповідь</p>
            <p className="text-2xl font-bold text-white">
              {(data.reduce((sum, q) => sum + q.answerRate, 0) / data.length).toFixed(1)}%
            </p>
          </div>
          <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700">
            <p className="text-xs text-zinc-400 mb-1">Середній відвал</p>
            <p className="text-2xl font-bold text-white">
              {(data.reduce((sum, q) => sum + q.dropOffRate, 0) / data.length).toFixed(1)}%
            </p>
          </div>
          <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700">
            <p className="text-xs text-zinc-400 mb-1">Проблемних питань</p>
            <p className="text-2xl font-bold text-red-500">
              {data.filter((q) => q.answerRate < 60 || q.dropOffRate > 20).length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
