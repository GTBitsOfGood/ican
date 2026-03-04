import { z } from "zod";
import { objectIdSchema } from "./commonSchemaUtil";
import { GameName, GameResult } from "@/types/games";

export const recordGameResultSchema = z.object({
  userId: objectIdSchema("UserId"),
  gameName: z.nativeEnum(GameName),
  result: z.nativeEnum(GameResult),
});

export const getGameStatisticsSchema = z.object({
  userId: objectIdSchema("UserId"),
});

export type RecordGameResult = z.infer<typeof recordGameResultSchema>;
export type GetGameStatistics = z.infer<typeof getGameStatisticsSchema>;

export const validateRecordGameResult = (data: unknown): RecordGameResult => {
  return recordGameResultSchema.parse(data);
};

export const validateGetGameStatistics = (data: unknown): GetGameStatistics => {
  return getGameStatisticsSchema.parse(data);
};
