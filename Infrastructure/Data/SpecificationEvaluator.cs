using Core.Entities;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class SpecificationEvaluator<TEntity> where TEntity : BaseEntity
    {
        // includes all the input entities and then aggregates them and passes them into the query and then returns them
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> InputQuery, ISpecification<TEntity> Spec)
        {
            var query = InputQuery;

            if (Spec.Criteria != null)
            {
                query = query.Where(Spec.Criteria); // p => p.product.id == id
            }

            // order by expression
            if (Spec.OrderBy != null)
            {
                query = query.OrderBy(Spec.OrderBy);
            }

            // order by descending expression
            if (Spec.OrderByDescending != null)
            {
                query = query.OrderByDescending(Spec.OrderByDescending);
            }

            if (Spec.IsPagingEnabled)
            {
                query = query.Skip(Spec.Skip).Take(Spec.Take);
            }

            query = Spec.Includes.Aggregate(query, (current, include) => current.Include(include));

            return query;
        }
    }
}