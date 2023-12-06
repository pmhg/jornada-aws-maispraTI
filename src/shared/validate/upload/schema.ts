import * as joi from "@hapi/joi";
import { messagesPtBr } from "@pmhg/leeurope-http-aws-api-node";

export const schema = joi.object()
    .keys({
        image: joi
            .string()
            .required()
            .messages(messagesPtBr),
        path: joi
            .string()
            .required()
            .messages(messagesPtBr)
    });
