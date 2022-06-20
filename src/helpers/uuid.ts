import crypto from "node:crypto";

const UUID = (options?: crypto.RandomUUIDOptions | undefined): string => crypto.randomUUID(options);

export default UUID;
