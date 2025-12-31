import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface QuestionTimeData {
  questionNumber: number;
  questionText: string;
  avgTime: number; // in seconds
  minTime: number;
  maxTime: number;
}

interface TimeAnalysisProps {
  data: QuestionTimeData[];
}

export function TimeAnalysis({ data }: TimeAnalysisProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-white mb-2">Питання {data.questionNumber}</p>
          <p className="text-sm text-zinc-300 mb-2 max-w-xs">{data.questionText}</p>
          <div className="space-y-1 text-xs">
            <p className="text-yellow-400">Середній час: {formatTime(data.avgTime)}</p>
            <p className="text-green-400">Мінімум: {formatTime(data.minTime)}</p>
            <p className="text-red-400">Максимум: {formatTime(data.maxTime)}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Find slowest questions
  const slowestQuestions = [...data].sort((a, b) => b.avgTime - a.avgTime).slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Аналіз часу</CardTitle>
        <CardDescription>
          Середній час на кожне питання
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="questionNumber"
                label={{ value: "Номер питання", position: "insideBottom", offset: -10, fill: "#9ca3af" }}
                tick={{ fill: "#9ca3af" }}
              />
              <YAxis
                label={{ value: "Час (секунди)", angle: -90, position: "insideLeft", fill: "#9ca3af" }}
                tick={{ fill: "#9ca3af" }}
                tickFormatter={(value) => formatTime(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="avgTime"
                stroke="#ffd93d"
                strokeWidth={3}
                name="Середній час"
                dot={{ fill: "#ffd93d", r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="minTime"
                stroke="#22c55e"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Мінімум"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="maxTime"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Максимум"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Slowest questions */}
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-semibold text-zinc-300">Найповільніші питання:</h4>
          <div className="grid gap-2">
            {slowestQuestions.map((question, index) => (
              <div
                key={question.questionNumber}
                className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center text-sm font-bold text-yellow-500">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Питання {question.questionNumber}</p>
                    <p className="text-xs text-zinc-400 truncate max-w-md">{question.questionText}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-yellow-500">{formatTime(question.avgTime)}</p>
                  <p className="text-xs text-zinc-400">середній час</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700">
            <p className="text-xs text-zinc-400 mb-1">Загальний час</p>
            <p className="text-lg font-bold text-white">
              {formatTime(data.reduce((sum, q) => sum + q.avgTime, 0))}
            </p>
          </div>
          <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700">
            <p className="text-xs text-zinc-400 mb-1">Середній час/питання</p>
            <p className="text-lg font-bold text-white">
              {formatTime(Math.round(data.reduce((sum, q) => sum + q.avgTime, 0) / data.length))}
            </p>
          </div>
          <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700">
            <p className="text-xs text-zinc-400 mb-1">Найшвидше питання</p>
            <p className="text-lg font-bold text-white">
              {formatTime(Math.min(...data.map((q) => q.avgTime)))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
