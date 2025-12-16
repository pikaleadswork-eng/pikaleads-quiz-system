import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DailyData {
  date: string;
  total: number;
  conversions: number;
  conversionRate: number;
}

interface VariantTrend {
  variantId: number;
  variantName: string;
  data: DailyData[];
}

interface ConversionChartProps {
  trends: VariantTrend[];
}

const COLORS = [
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#ef4444", // red
];

export function ConversionChart({ trends }: ConversionChartProps) {
  // Transform data for recharts
  const chartData = useMemo(() => {
    if (!trends || trends.length === 0) return [];

    // Get all unique dates
    const allDates = new Set<string>();
    trends.forEach(variant => {
      variant.data.forEach(day => allDates.add(day.date));
    });

    // Sort dates
    const sortedDates = Array.from(allDates).sort();

    // Build chart data
    return sortedDates.map(date => {
      const dataPoint: any = { date };
      
      trends.forEach(variant => {
        const dayData = variant.data.find(d => d.date === date);
        dataPoint[`${variant.variantName}_rate`] = dayData?.conversionRate || 0;
        dataPoint[`${variant.variantName}_conversions`] = dayData?.conversions || 0;
        dataPoint[`${variant.variantName}_total`] = dayData?.total || 0;
      });

      return dataPoint;
    });
  }, [trends]);

  const totalConversionsData = useMemo(() => {
    if (!trends || trends.length === 0) return [];

    const allDates = new Set<string>();
    trends.forEach(variant => {
      variant.data.forEach(day => allDates.add(day.date));
    });

    const sortedDates = Array.from(allDates).sort();

    return sortedDates.map(date => {
      const dataPoint: any = { date };
      
      trends.forEach(variant => {
        const dayData = variant.data.find(d => d.date === date);
        dataPoint[variant.variantName] = dayData?.conversions || 0;
      });

      return dataPoint;
    });
  }, [trends]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => {
            const variantName = entry.name.replace('_rate', '').replace('_conversions', '');
            const isRate = entry.name.includes('_rate');
            const isConversions = entry.name.includes('_conversions');
            
            if (!isRate && !isConversions) return null;
            
            // Find corresponding data
            const rateKey = `${variantName}_rate`;
            const conversionsKey = `${variantName}_conversions`;
            const totalKey = `${variantName}_total`;
            
            const rate = payload.find((p: any) => p.name === rateKey)?.value || 0;
            const conversions = payload.find((p: any) => p.name === conversionsKey)?.value || 0;
            const total = payload.find((p: any) => p.name === totalKey)?.value || 0;
            
            if (isRate) {
              return (
                <div key={index} className="flex items-center gap-2 mt-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-zinc-300 text-sm">
                    {variantName}: <span className="text-white font-medium">{rate.toFixed(2)}%</span>
                    <span className="text-zinc-500 text-xs ml-1">
                      ({conversions}/{total})
                    </span>
                  </span>
                </div>
              );
            }
            
            return null;
          })}
        </div>
      );
    }
    return null;
  };

  const ConversionsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mt-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-zinc-300 text-sm">
                {entry.name}: <span className="text-white font-medium">{entry.value}</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!trends || trends.length === 0) {
    return (
      <Card className="p-6 bg-zinc-900 border-zinc-800">
        <p className="text-zinc-400 text-center">Недостатньо даних для відображення графіків</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-zinc-900 border-zinc-800">
      <h3 className="text-lg font-semibold text-white mb-4">Аналітика конверсій</h3>
      
      <Tabs defaultValue="rate" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="rate">Conversion Rate (%)</TabsTrigger>
          <TabsTrigger value="total">Total Conversions</TabsTrigger>
        </TabsList>

        <TabsContent value="rate" className="mt-0">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis 
                dataKey="date" 
                stroke="#71717a"
                tick={{ fill: '#a1a1aa' }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis 
                stroke="#71717a"
                tick={{ fill: '#a1a1aa' }}
                label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft', fill: '#a1a1aa' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => value.replace('_rate', '')}
              />
              {trends.map((variant, index) => (
                <Line
                  key={variant.variantId}
                  type="monotone"
                  dataKey={`${variant.variantName}_rate`}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ fill: COLORS[index % COLORS.length], r: 4 }}
                  activeDot={{ r: 6 }}
                  name={variant.variantName}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="total" className="mt-0">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={totalConversionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis 
                dataKey="date" 
                stroke="#71717a"
                tick={{ fill: '#a1a1aa' }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis 
                stroke="#71717a"
                tick={{ fill: '#a1a1aa' }}
                label={{ value: 'Conversions', angle: -90, position: 'insideLeft', fill: '#a1a1aa' }}
              />
              <Tooltip content={<ConversionsTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {trends.map((variant, index) => (
                <Line
                  key={variant.variantId}
                  type="monotone"
                  dataKey={variant.variantName}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ fill: COLORS[index % COLORS.length], r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
