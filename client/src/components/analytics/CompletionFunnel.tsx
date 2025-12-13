import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface FunnelStep {
  questionNumber: number;
  questionText: string;
  views: number;
  answers: number;
  dropOffs: number;
  dropOffRate: number;
}

interface CompletionFunnelProps {
  steps: FunnelStep[];
}

export function CompletionFunnel({ steps }: CompletionFunnelProps) {
  // Color gradient from green to red based on drop-off rate
  const getColor = (dropOffRate: number) => {
    if (dropOffRate < 10) return "#22c55e"; // green
    if (dropOffRate < 20) return "#84cc16"; // lime
    if (dropOffRate < 30) return "#eab308"; // yellow
    if (dropOffRate < 40) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-white mb-2">Питання {data.questionNumber}</p>
          <p className="text-sm text-zinc-300 mb-2">{data.questionText}</p>
          <div className="space-y-1 text-xs">
            <p className="text-blue-400">Переглядів: {data.views.toLocaleString()}</p>
            <p className="text-green-400">Відповідей: {data.answers.toLocaleString()}</p>
            <p className="text-red-400">Відвалилось: {data.dropOffs.toLocaleString()}</p>
            <p className="text-yellow-400 font-semibold">Відвал: {data.dropOffRate.toFixed(1)}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Воронка завершення</CardTitle>
        <CardDescription>
          Точки відвалу користувачів по кроках квізу
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={steps} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="questionNumber"
                label={{ value: "Номер питання", position: "insideBottom", offset: -10, fill: "#9ca3af" }}
                tick={{ fill: "#9ca3af" }}
              />
              <YAxis
                label={{ value: "Кількість користувачів", angle: -90, position: "insideLeft", fill: "#9ca3af" }}
                tick={{ fill: "#9ca3af" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="views" name="Переглядів" radius={[8, 8, 0, 0]}>
                {steps.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.dropOffRate)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Drop-off highlights */}
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-semibold text-zinc-300">Найбільші точки відвалу:</h4>
          <div className="grid gap-2">
            {steps
              .sort((a, b) => b.dropOffRate - a.dropOffRate)
              .slice(0, 3)
              .map((step, index) => (
                <div
                  key={step.questionNumber}
                  className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: getColor(step.dropOffRate) }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Питання {step.questionNumber}</p>
                      <p className="text-xs text-zinc-400 truncate max-w-md">{step.questionText}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: getColor(step.dropOffRate) }}>
                      {step.dropOffRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-zinc-400">{step.dropOffs} відвалилось</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
