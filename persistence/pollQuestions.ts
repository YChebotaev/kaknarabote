import { groupBy, toPairs } from 'lodash'
import { knex } from './knex'
import { logger } from './logger'
import { PollQuestion } from './types'

export const pollQuestionCreate = async ({
  accountId,
  pollId,
  aggregationIndex,
  measurenmentName,
  text
}: {
  accountId: number
  pollId: number
  aggregationIndex: number
  measurenmentName: string,
  text: string
}) => {
  const [{ id }] = await knex
    .insert({
      accountId,
      pollId,
      aggregationIndex,
      measurenmentName,
      text,
      minScore: 1,
      maxScore: 5,
      textFeedbackRequestTreshold: 3,
      createdAt: new Date().getTime()
    })
    .into('pollQuestions')
    .returning('id')

  logger.info(
    'Poll question created with id = %s for account id = %s and text = "%s"',
    id,
    accountId,
    text
  )

  return id as number
}

export const pollQuestionGet = async (id: number) => {
  const pollQuestion = await knex
    .select('*')
    .from('pollQuestions')
    .where('id', id)
    .first<PollQuestion>()

  if (!pollQuestion) {
    logger.warn("Poll question with id = %s not found", id)

    return
  }

  if (pollQuestion.deleted) {
    logger.warn("Poll question with id = %s was found, but deleted", id)

    return
  }

  return pollQuestion
}

export const pollQuestionsGetByPollId = async (pollId: number) => {
  return (await knex
    .select<PollQuestion[]>('*')
    .from('pollQuestions')
    .where('pollId', pollId))
    .filter(({ deleted }) => !deleted)
}

export const pollQuestionsByAccountIdUniqByAggregationIndex = async ({ accountId }: { accountId: number }) => {
  const pollQuestions = (await knex
    .select<PollQuestion[]>('*')
    .from('pollQuestions')
    .where('accountId', accountId))
    .filter(({ deleted }) => !deleted)

  const groupsByAggregationIndex = groupBy(pollQuestions, 'aggregationIndex')

  return toPairs(groupsByAggregationIndex).map(([aggregationIndexStr, pollQuestions]) => pollQuestions[0])
}

export const pollQuestionDelete = async (id: number) => {
  await knex('pollQuestions')
    .update({
      deleted: true,
      updatedAt: new Date().getTime()
    })
    .where('id', id)

  logger.info('Poll question with id = %s deleted', id)
}
