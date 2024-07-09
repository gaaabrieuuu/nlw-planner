import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";

const createTrip = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips",
    {
      schema: {
        body: z.object({
          destination: z.string(),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
        }),
      },
    },
    async (request) => {
      const { destination, ends_at, starts_at, owner_name, owner_email } = request.body;

      if (dayjs(starts_at).isBefore(new Date())) {
        throw new Error("Invalid trip start date.");
      }

      if (dayjs(ends_at).isBefore(starts_at)) {
        throw new Error("Invalid trip end date.");
      }

      try {
        const trip = await prisma.trip.create({
          data: {
            destination,
            ends_at,
            starts_at,
          },
        });
        return {
          status: 200,
          tripId: trip.id,
        };
      } catch {
        return {
          status: 500,
          message: "Erro ao cadastrar",
        };
      }
    }
  );
};

export { createTrip };
