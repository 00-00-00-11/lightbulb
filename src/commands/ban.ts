import { Permissions } from 'discord.js';
import { CommandExecute, CommandMetadata } from '../types';
import { getCases } from '../util';
import { get, interpolate } from '../util/i18n';
import { ERROR_CODES, WHITELIST } from '../constants';
export const execute: CommandExecute = async ({ message, args, locale }) => {
  if (!args[0]) return false;
  if (!message.guild.me!.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
    return false;
  const target = await message.client.users
    .fetch(args[0].replace(/(<@!?|>)/g, ''))
    .catch(() => null);
  if (!target) return false;
  const member = await message.guild.members.fetch(target.id).catch(() => null);
  const ban = async () => {
    try {
      await message.guild.members
        .ban(target.id, {
          reason: `[ ${message.author.tag} ]: ${
            args.slice(1).join(' ') ||
            `*responsible moderator, do \`reason ${
              (await getCases(message.guild)) + 1
            } <reason>\`*`
          }`,
        })
        .then(() => {
          message.channel.send(
            interpolate(get('BAN_SUCCESSFUL', locale), { target: target.tag })
          );
        });
    } catch (e) {
      message.channel.send(
        interpolate(get('GENERIC_ERROR', locale), {
          code: ERROR_CODES.BAN_UNSUCCESSFUL.toString(),
          message: e,
        })
      );
    }
  };
  if (!member) {
    ban();
  }
  if (member?.user.id === message.guild.ownerID) {
    message.channel.send(
      interpolate(get('GENERIC_ERROR', locale), {
        code: ERROR_CODES.TARGET_IS_OWNER.toString(),
        message: 'Target is owner',
      })
    );
    return false;
  }
  if (
    member?.user.id === message.client.user?.id ||
    WHITELIST.includes(target.id)
  ) {
    message.channel.send(
      interpolate(get('GENERIC_ERROR', locale), {
        code: ERROR_CODES.DISALLOWED_TARGET.toString(),
        message: 'Disallowed target',
      })
    );
    return false;
  }
  if (member?.user.id === message.author.id) {
    message.channel.send(
      interpolate(get('GENERIC_ERROR', locale), {
        code: ERROR_CODES.SELF_IS_MODERATION_TARGET.toString(),
        message: 'Self is moderation target',
      })
    );
    return false;
  }
  if (member)
    if (
      !member.manageable ||
      member.roles.highest.rawPosition >=
        message.member.roles.highest.rawPosition
    ) {
      message.channel.send(
        interpolate(get('BAN_INSUFFICIENT_PERMISSIONS', locale), {
          target: member.user.tag,
        })
      );
      return false;
    } else {
      ban();
    }
  return true;
};

export const meta: CommandMetadata = {
  name: 'ban',
  description: 'Bans a member from the guild.',
  accessLevel: 2,
  aliases: [],
  hidden: false,
};
